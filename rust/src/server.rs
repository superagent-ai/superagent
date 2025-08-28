use std::collections::HashMap;
use std::convert::Infallible;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Instant;

use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Client, Method, Request, Response, Server, StatusCode};
use hyper_tls::HttpsConnector;
use serde_json::Value;
use tokio::sync::{Mutex, RwLock};
use tracing::{info, warn};
use uuid::Uuid;
use redis::{AsyncCommands, ConnectionManager};

use crate::config::ConfigManager;
use crate::redaction::{RedactionEngine, RedactionService};
use crate::{Error, Result};

#[derive(Debug, Clone)]
struct SseAccumulator {
    buffer: String,
}

pub struct ProxyServer {
    port: u16,
    request_count: Arc<Mutex<u64>>,
    redaction_engine: RedactionEngine,
    redaction_service: RedactionService,
    config_manager: Arc<RwLock<ConfigManager>>,
    client: Client<HttpsConnector<hyper::client::HttpConnector>>,
    sse_content_accumulators: Arc<RwLock<HashMap<u64, SseAccumulator>>>,
    redis_client: Option<ConnectionManager>,
}

impl ProxyServer {
    pub async fn new(port: u16, config_path: Option<String>, redaction_api_url: Option<String>) -> Result<Self> {
        let https = HttpsConnector::new();
        let client = Client::builder().build::<_, hyper::Body>(https);
        
        let mut config_manager = ConfigManager::new_with_path(config_path.clone());
        if let Err(e) = config_manager.load_config().await {
            warn!(
                event_type = "config_load_failed",
                config_path = config_path.as_deref().unwrap_or("default"),
                error = %e,
                "Could not load config file, using defaults"
            );
        }

        // Initialize Redis connection pool if in multitenant mode
        let redis_client = if std::env::var("MULTITENANT").unwrap_or_default() == "true" {
            let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());
            match redis::Client::open(redis_url.as_str()) {
                Ok(client) => {
                    match ConnectionManager::new(client).await {
                        Ok(manager) => {
                            println!("[REDIS] Connection pool initialized successfully");
                            Some(manager)
                        },
                        Err(e) => {
                            eprintln!("[REDIS] Failed to initialize Redis connection pool: {}", e);
                            None
                        }
                    }
                },
                Err(e) => {
                    eprintln!("[REDIS] Failed to initialize Redis client: {}", e);
                    None
                }
            }
        } else {
            None
        };

        Ok(Self {
            port,
            request_count: Arc::new(Mutex::new(0)),
            redaction_engine: RedactionEngine::new(),
            redaction_service: RedactionService::new(redaction_api_url),
            config_manager: Arc::new(RwLock::new(config_manager)),
            client,
            sse_content_accumulators: Arc::new(RwLock::new(HashMap::new())),
            redis_client,
        })
    }

    pub async fn start(&self) -> Result<()> {
        let addr = SocketAddr::from(([0, 0, 0, 0], self.port));
        
        info!(
            event_type = "server_start",
            service = "ai-firewall-rust",
            version = "0.0.1",
            port = self.port,
            address = %addr,
            "Proxy server starting"
        );
        
        let server_clone = Arc::new(self.clone());
        let make_svc = make_service_fn(move |_conn| {
            let server = Arc::clone(&server_clone);
            async move {
                Ok::<_, Infallible>(service_fn(move |req| {
                    let server = Arc::clone(&server);
                    async move { server.handle_request(req).await }
                }))
            }
        });

        let server = Server::bind(&addr).serve(make_svc);
        info!(
            event_type = "server_listening",
            address = %addr,
            "Proxy server listening"
        );

        if let Err(e) = server.await {
            return Err(Error::Server(e.to_string()));
        }

        Ok(())
    }

    pub async fn stop(&self) {
        info!(
            event_type = "server_stop",
            "Stopping proxy server"
        );
    }

    async fn handle_request(&self, req: Request<Body>) -> std::result::Result<Response<Body>, Infallible> {
        let result = self.handle_request_inner(req).await;
        Ok(result.unwrap_or_else(|e| {
            Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body(Body::from(format!("Internal Server Error: {}", e)))
                .unwrap()
        }))
    }

    async fn get_config_for_multitenant(&self, config_id: &str, model_name: Option<&str>) -> Result<crate::config::ResolvedModelConfig> {
        println!("[MULTITENANT] Config ID: {}, Model: {:?}", config_id, model_name);
        
        let cache_key = format!("config:{}", config_id);
        let cache_ttl: u64 = std::env::var("CONFIG_CACHE_TTL")
            .unwrap_or_else(|_| "3600".to_string())
            .parse()
            .unwrap_or(3600);
        
        let mut all_configs: Option<Vec<serde_json::Value>> = None;
        
        // Try Redis cache first
        if let Some(redis_client) = &self.redis_client {
            let mut conn = redis_client.clone();
            match conn.get::<_, String>(&cache_key).await {
                Ok(cached_data) => {
                    println!("[MULTITENANT] Cache HIT for config ID: {}", config_id);
                    if let Ok(configs) = serde_json::from_str::<Vec<serde_json::Value>>(&cached_data) {
                        all_configs = Some(configs);
                    }
                },
                Err(_) => {
                    println!("[MULTITENANT] Cache MISS for config ID: {}", config_id);
                }
            }
        }
        
        // Fetch from API if not in cache
        if all_configs.is_none() {
            let config_api_url = std::env::var("MULTITENANT_CONFIG_API_URL")
                .map_err(|_| Error::Server("MULTITENANT_CONFIG_API_URL environment variable is required when MULTITENANT=true".to_string()))?;
            
            let full_url = format!("{}{}", config_api_url, config_id);
            println!("[MULTITENANT] Fetching config from: {}", full_url);
            
            let response = reqwest::Client::new().get(&full_url).send().await
                .map_err(|e| Error::Server(format!("Failed to fetch config for {}: {}", config_id, e)))?;
            
            if !response.status().is_success() {
                return Err(Error::Server(format!("Config API returned {}: {}", response.status(), response.status().canonical_reason().unwrap_or("Unknown"))));
            }
            
            let configs = response.json::<serde_json::Value>().await
                .map_err(|e| Error::Server(format!("Failed to parse config response for {}: {}", config_id, e)))?;
            
            println!("[MULTITENANT] Received configs: {}", serde_json::to_string_pretty(&configs).unwrap_or_default());
            
            let configs_array = configs.as_array()
                .ok_or_else(|| Error::Server("Config API returned invalid configuration format".to_string()))?;
            
            if configs_array.is_empty() {
                return Err(Error::Server("Config API returned empty configuration array".to_string()));
            }
            
            all_configs = Some(configs_array.clone());
            
            // Cache the configuration in Redis
            if let Some(redis_client) = &self.redis_client {
                let mut conn = redis_client.clone();
                if let Ok(configs_json) = serde_json::to_string(&configs_array) {
                    match conn.set_ex::<_, _, ()>(&cache_key, &configs_json, cache_ttl as usize).await {
                        Ok(_) => println!("[MULTITENANT] Cached config for {} with TTL {} seconds", config_id, cache_ttl),
                        Err(e) => eprintln!("[REDIS] Failed to cache config: {}", e),
                    }
                }
            }
        }
        
        // Find model-specific configuration
        if let (Some(model_name), Some(all_configs)) = (model_name, &all_configs) {
            for config in all_configs {
                if let Some(config_model_name) = config.get("model_name").and_then(|v| v.as_str()) {
                    if config_model_name == model_name {
                        println!("[MULTITENANT] Found specific config for model: {}", model_name);
                        return Ok(crate::config::ResolvedModelConfig {
                            provider: config.get("provider").and_then(|v| v.as_str()).unwrap_or("openai").to_string(),
                            api_base: config.get("api_base").and_then(|v| v.as_str()).unwrap_or("https://api.openai.com/").to_string(),
                            model_name: config.get("model_name").and_then(|v| v.as_str()).unwrap_or(model_name).to_string(),
                        });
                    }
                }
            }
            
            // If model specified but not found, throw error
            return Err(Error::Server(format!("Model '{}' not found in configuration for config_id: {}", model_name, config_id)));
        }
        
        // If no model specified, throw error
        Err(Error::Server("Model must be specified in request body for multitenant configuration".to_string()))
    }

    async fn handle_config_cache_update(&self, req: Request<Body>, config_id: &str) -> Result<Response<Body>> {
        if config_id.is_empty() {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("content-type", "application/json")
                .body(Body::from(r#"{"error": "Config ID is required"}"#))?);
        }

        // Capture request body
        let body_bytes = hyper::body::to_bytes(req.into_body()).await?;
        let request_body = String::from_utf8_lossy(&body_bytes);

        if request_body.is_empty() {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("content-type", "application/json")
                .body(Body::from(r#"{"error": "Request body with config array is required"}"#))?);
        }

        // Parse and validate the new config
        let new_config: serde_json::Value = match serde_json::from_str(&request_body) {
            Ok(config) => config,
            Err(e) => {
                eprintln!("[CONFIG-CACHE] Error parsing config for {}: {}", config_id, e);
                return Ok(Response::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .header("content-type", "application/json")
                    .body(Body::from(format!(r#"{{"error": "Invalid JSON", "details": "{}"}}"#, e)))?);
            }
        };

        // Validate that it's an array
        if !new_config.is_array() {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("content-type", "application/json")
                .body(Body::from(r#"{"error": "Config must be an array"}"#))?);
        }

        let cache_key = format!("config:{}", config_id);
        let cache_ttl: u64 = std::env::var("CONFIG_CACHE_TTL")
            .unwrap_or_else(|_| "3600".to_string())
            .parse()
            .unwrap_or(3600);

        // Update cache in Redis
        if let Some(redis_client) = &self.redis_client {
            let mut conn = redis_client.clone();
            let config_json = serde_json::to_string(&new_config).unwrap();
            match conn.set_ex::<_, _, ()>(&cache_key, &config_json, cache_ttl as usize).await {
                Ok(_) => {
                    println!("[CONFIG-CACHE] Updated cache for {} with TTL {} seconds", config_id, cache_ttl);
                    let models_count = new_config.as_array().unwrap().len();
                    let response = serde_json::json!({
                        "success": true,
                        "message": format!("Config cache updated for {}", config_id),
                        "models": models_count
                    });
                    return Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("content-type", "application/json")
                        .body(Body::from(response.to_string()))?);
                },
                Err(e) => {
                    eprintln!("[CONFIG-CACHE] Redis error updating cache for {}: {}", config_id, e);
                    return Ok(Response::builder()
                        .status(StatusCode::INTERNAL_SERVER_ERROR)
                        .header("content-type", "application/json")
                        .body(Body::from(format!(r#"{{"error": "Redis error", "details": "{}"}}"#, e)))?);
                }
            }
        } else {
            return Ok(Response::builder()
                .status(StatusCode::SERVICE_UNAVAILABLE)
                .header("content-type", "application/json")
                .body(Body::from(r#"{"error": "Redis client not available"}"#))?);
        }
    }

    async fn redact_content(&self, content: &mut Value) -> Result<Value> {
        match content {
            Value::String(text) => {
                let redacted = self.redaction_service.redact_user_prompt(text).await?;
                Ok(Value::String(redacted))
            }
            Value::Array(content_blocks) => {
                let mut redacted_blocks = Vec::new();
                for block in content_blocks.iter() {
                    if let Some(block_obj) = block.as_object() {
                        if let Some(block_type) = block_obj.get("type") {
                            if block_type == "text" {
                                if let Some(text) = block_obj.get("text").and_then(|t| t.as_str()) {
                                    let redacted_text = self.redaction_service.redact_user_prompt(text).await?;
                                    let mut new_block = block_obj.clone();
                                    new_block.insert("text".to_string(), Value::String(redacted_text));
                                    redacted_blocks.push(Value::Object(new_block));
                                } else {
                                    redacted_blocks.push(block.clone());
                                }
                            } else {
                                // Non-text blocks (like tool_result) pass through unchanged
                                redacted_blocks.push(block.clone());
                            }
                        } else {
                            redacted_blocks.push(block.clone());
                        }
                    } else {
                        redacted_blocks.push(block.clone());
                    }
                }
                Ok(Value::Array(redacted_blocks))
            }
            _ => Ok(content.clone()),
        }
    }

    async fn handle_request_inner(&self, req: Request<Body>) -> Result<Response<Body>> {
        let start_time = Instant::now();
        let trace_id = Uuid::new_v4().to_string();

        // Health check endpoint
        if req.uri().path() == "/health" && req.method() == Method::GET {
            info!(
                event_type = "health_check",
                trace_id = %trace_id,
                "Health check requested"
            );

            let request_count = self.request_count.lock().await;
            let count = *request_count;
            drop(request_count);

            let health_data = serde_json::json!({
                "status": "healthy",
                "uptime": std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                "timestamp": chrono::Utc::now(),
                "requestCount": count
            });

            return Ok(Response::builder()
                .status(StatusCode::OK)
                .header("content-type", "application/json")
                .body(Body::from(health_data.to_string()))?);
        }
        
        // Config cache update endpoint
        if req.uri().path().starts_with("/config/") && req.method() == Method::POST {
            let config_id = req.uri().path().strip_prefix("/config/").unwrap_or("").to_string();
            return self.handle_config_cache_update(req, &config_id).await;
        }

        let mut request_count = self.request_count.lock().await;
        *request_count += 1;
        let request_id = *request_count;
        drop(request_count);

        // Capture request body
        let (parts, body) = req.into_parts();
        let body_bytes = hyper::body::to_bytes(body).await?;
        let request_body = String::from_utf8_lossy(&body_bytes);

        self.process_request_with_config(request_body.to_string(), parts, request_id, start_time, trace_id).await
    }

    async fn process_request_with_config(
        &self,
        request_body: String,
        parts: http::request::Parts,
        request_id: u64,
        start_time: Instant,
        trace_id: String,
    ) -> Result<Response<Body>> {
        // Extract model name from request body and process user message redaction
        let mut model_name = None;
        let processed_request_body = if !request_body.is_empty() {
            if let Ok(mut parsed_body) = serde_json::from_str::<Value>(&request_body) {
                if let Some(model) = parsed_body.get("model") {
                    if let Some(model_str) = model.as_str() {
                        model_name = Some(model_str.to_string());
                    }
                }

                // Process user messages for redaction
                if let Some(messages) = parsed_body.get_mut("messages") {
                    if let Some(messages_array) = messages.as_array_mut() {
                        for message in messages_array.iter_mut() {
                            if let Some(message_obj) = message.as_object_mut() {
                                if let Some(role) = message_obj.get("role") {
                                    if role == "user" {
                                        if let Some(content) = message_obj.get_mut("content") {
                                            match self.redact_content(content).await {
                                                Ok(redacted_content) => {
                                                    *content = redacted_content;
                                                }
                                                Err(e) => {
                                                    warn!("Failed to redact user message: {}", e);
                                                    // Continue with original content on redaction failure
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                serde_json::to_string(&parsed_body).unwrap_or_else(|_| request_body.clone())
            } else {
                request_body.clone()
            }
        } else {
            request_body.clone()
        };

        // Parse the target URL - handle relative URLs by prepending API base
        let target_url = if parts.uri.path().starts_with('/') {
            // Check for multitenant mode
            let is_multitenant = std::env::var("MULTITENANT").unwrap_or_default() == "true";
            let mut config_id: Option<String> = None;
            let actual_path = if is_multitenant {
                let path_segments: Vec<&str> = parts.uri.path().split('/').filter(|s| !s.is_empty()).collect();
                if !path_segments.is_empty() {
                    config_id = Some(path_segments[0].to_string());
                    let rewritten_path = format!("/{}", path_segments[1..].join("/"));
                    
                    println!("[MULTITENANT] Config ID: {}", config_id.as_ref().unwrap());
                    println!("[MULTITENANT] Rewritten path: {}", rewritten_path);
                    
                    rewritten_path
                } else {
                    parts.uri.path().to_string()
                }
            } else {
                parts.uri.path().to_string()
            };
            
            let model_config = if let Some(ref config_id) = config_id {
                self.get_config_for_multitenant(config_id, model_name.as_deref()).await?
            } else {
                // Use model from config - always require model to be specified
                let model = model_name.as_ref().ok_or_else(|| {
                    Error::Server("Bad Request: Model must be specified in request body".to_string())
                })?;
                
                let config_manager = self.config_manager.read().await;
                let model_config = config_manager.get_model_config(&model);
                crate::config::ResolvedModelConfig {
                    provider: model_config.provider,
                    api_base: model_config.api_base,
                    model_name: model_config.model_name,
                }
            };
            
            let base_url = if model_config.api_base.ends_with('/') {
                model_config.api_base
            } else {
                format!("{}/", model_config.api_base)
            };
            
            let path = if actual_path.starts_with('/') {
                &actual_path[1..]
            } else {
                &actual_path
            };
            
            let final_url = format!("{}{}{}", base_url, path, 
                parts.uri.query().map_or(String::new(), |q| format!("?{}", q)));
            
            final_url
        } else {
            // Absolute URL
            parts.uri.to_string()
        };

        // Build the proxied request
        let reqwest_method = match parts.method.as_str() {
            "GET" => reqwest::Method::GET,
            "POST" => reqwest::Method::POST,
            "PUT" => reqwest::Method::PUT,
            "DELETE" => reqwest::Method::DELETE,
            "PATCH" => reqwest::Method::PATCH,
            "HEAD" => reqwest::Method::HEAD,
            "OPTIONS" => reqwest::Method::OPTIONS,
            _ => reqwest::Method::GET, // fallback
        };

        let mut req_builder = reqwest::Client::new()
            .request(reqwest_method, &target_url);

        // Copy headers (clean up proxy-specific ones)
        for (name, value) in parts.headers.iter() {
            if !matches!(name.as_str(), "host" | "proxy-connection" | "proxy-authorization") {
                if let Ok(header_value) = value.to_str() {
                    req_builder = req_builder.header(name.as_str(), header_value);
                }
            }
        }

        // Add request body (using processed body with redacted user messages)
        if !processed_request_body.is_empty() {
            req_builder = req_builder.body(processed_request_body.clone());
        }

        // Make the proxied request
        let proxy_response = req_builder.send().await?;
        let response_status = proxy_response.status();

        // Check if this is an SSE response
        let is_sse = proxy_response
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .map_or(false, |ct| ct.contains("text/event-stream"));

        // Extract headers for logging
        let user_agent = parts.headers.get("user-agent")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("")
            .to_string();
        let originator = parts.headers.get("originator")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("")
            .to_string();

        let response = if is_sse {
            self.handle_sse_response(proxy_response, &target_url, request_id).await
        } else {
            // Handle regular responses
            let response_body = proxy_response.text().await?;
            let response_size = response_body.len();
            let redacted_response = self.redaction_engine.redact_sensitive_content(&response_body);
            
            let result = Ok(Response::builder()
                .status(response_status)
                .header("content-type", "application/json")
                .body(Body::from(redacted_response))?);

            // Log request body before processing
            info!(
                event_type = "request_body",
                trace_id = %trace_id,
                method = %parts.method,
                url = %parts.uri,
                model = model_name.as_deref().unwrap_or(""),
                body_size_bytes = request_body.len(),
                body = %request_body,
                processed_body = %processed_request_body,
                redaction_occurred = processed_request_body != request_body,
                "Request body received"
            );

            // Log the completed request
            let duration = start_time.elapsed();
            let input_redacted = processed_request_body != request_body;
            
            info!(
                event_type = "request_processed",
                trace_id = %trace_id,
                method = %parts.method,
                url = %parts.uri,
                model = model_name.as_deref().unwrap_or(""),
                user_agent = %user_agent,
                originator = %originator,
                body_size_bytes = request_body.len(),
                status = %response_status.as_u16(),
                duration_ms = duration.as_millis() as u64,
                response_size_bytes = response_size,
                is_sse = false,
                input_redacted = input_redacted,
                output_redacted = true, // Always true for non-SSE responses
                target_url = %target_url,
                model_routing = model_name.is_some(),
                "Request processed"
            );

            result
        };

        // For SSE responses, we'll log after the stream completes
        if is_sse {
            // Log request body for SSE responses too
            info!(
                event_type = "request_body",
                trace_id = %trace_id,
                method = %parts.method,
                url = %parts.uri,
                model = model_name.as_deref().unwrap_or(""),
                body_size_bytes = request_body.len(),
                body = %request_body,
                processed_body = %processed_request_body,
                redaction_occurred = processed_request_body != request_body,
                "Request body received (SSE)"
            );

            let duration = start_time.elapsed();
            let input_redacted = processed_request_body != request_body;
            
            info!(
                event_type = "request_processed",
                trace_id = %trace_id,
                method = %parts.method,
                url = %parts.uri,
                model = model_name.as_deref().unwrap_or(""),
                user_agent = %user_agent,
                originator = %originator,
                body_size_bytes = request_body.len(),
                status = %response_status.as_u16(),
                duration_ms = duration.as_millis() as u64,
                response_size_bytes = 0, // Not easily measurable for SSE
                is_sse = true,
                input_redacted = input_redacted,
                output_redacted = true, // SSE responses are redacted
                target_url = %target_url,
                model_routing = model_name.is_some(),
                "SSE request processed"
            );
        }

        response
    }

    async fn handle_sse_response(
        &self,
        proxy_response: reqwest::Response,
        target_url: &str,
        request_id: u64,
    ) -> Result<Response<Body>> {
        use futures::StreamExt;
        

        // Initialize SSE accumulator for this request
        self.sse_content_accumulators.write().await.insert(
            request_id,
            SseAccumulator {
                buffer: String::new(),
            },
        );

        // Detect if this is OpenAI format
        let is_openai_format = target_url.contains("openai.com") || target_url.contains("/responses");

        // Create streaming body
        let (tx, rx) = tokio::sync::mpsc::channel::<std::result::Result<bytes::Bytes, Box<dyn std::error::Error + Send + Sync>>>(100);

        // Clone necessary data for the async task
        let redaction_engine = self.redaction_engine.clone();
        let sse_accumulators = Arc::clone(&self.sse_content_accumulators);

        // Spawn task to process SSE stream
        tokio::spawn(async move {
            let mut event_buffer = String::new();
            let mut stream = proxy_response.bytes_stream();

            while let Some(chunk_result) = stream.next().await {
                match chunk_result {
                    Ok(chunk) => {
                        let chunk_str = String::from_utf8_lossy(&chunk);
                        event_buffer.push_str(&chunk_str);

                        // Split by double newlines to get complete events
                        let buffer_clone = event_buffer.clone();
                        let events: Vec<&str> = buffer_clone.split("\n\n").collect();
                        
                        if events.len() > 1 {
                            // Keep the last (potentially incomplete) event in buffer
                            event_buffer = events.last().unwrap_or(&"").to_string();

                            // Process complete events
                            for event_data in &events[..events.len() - 1] {
                                if !event_data.trim().is_empty() {
                                    if let Some(processed_event) = Self::process_sse_event(
                                        event_data,
                                        request_id,
                                        is_openai_format,
                                        &redaction_engine,
                                        &sse_accumulators,
                                    ).await {
                                        let event_bytes = bytes::Bytes::from(format!("{}\n\n", processed_event));
                                        if tx.send(Ok(event_bytes)).await.is_err() {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    Err(e) => {
                        let _ = tx.send(Err(Box::new(e) as Box<dyn std::error::Error + Send + Sync>)).await;
                        break;
                    }
                }
            }

            // Handle any remaining buffered event
            if !event_buffer.trim().is_empty() {
                if let Some(processed_event) = Self::process_sse_event(
                    &event_buffer,
                    request_id,
                    is_openai_format,
                    &redaction_engine,
                    &sse_accumulators,
                ).await {
                    let event_bytes = bytes::Bytes::from(format!("{}\n\n", processed_event));
                    let _ = tx.send(Ok(event_bytes)).await;
                }
            }

            // Clean up
            sse_accumulators.write().await.remove(&request_id);
        });

        // Create streaming response
        let stream = tokio_stream::wrappers::ReceiverStream::new(rx);
        let body = Body::wrap_stream(stream.map(|item| {
            item.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))
        }));

        Ok(Response::builder()
            .status(StatusCode::OK)
            .header("content-type", "text/event-stream")
            .header("cache-control", "no-cache")
            .header("connection", "keep-alive")
            .body(body)?)
    }

    async fn process_sse_event(
        event_data: &str,
        request_id: u64,
        is_openai_format: bool,
        redaction_engine: &RedactionEngine,
        sse_accumulators: &Arc<RwLock<HashMap<u64, SseAccumulator>>>,
    ) -> Option<String> {
        let lines: Vec<&str> = event_data.split('\n').collect();
        let mut event_type = String::new();
        let mut event_data_json: Option<serde_json::Value> = None;

        // Parse SSE event
        for line in lines {
            if let Some(event_value) = line.strip_prefix("event: ") {
                event_type = event_value.to_string();
            } else if let Some(data_value) = line.strip_prefix("data: ") {
                if let Ok(data) = serde_json::from_str::<serde_json::Value>(data_value) {
                    event_data_json = Some(data);
                } else {
                    // Handle non-JSON data (like [DONE])
                    if data_value == "[DONE]" {
                        return Some(event_data.to_string());
                    }
                }
            }
        }

        // Extract text content for redaction
        let mut should_redact_and_forward = false;
        let mut text_content = String::new();

        if let Some(data) = &event_data_json {
            
            if is_openai_format {
                // Handle OpenAI streaming format
                if event_type == "response.output_text.delta" {
                    if let Some(delta) = data.get("delta").and_then(|d| d.as_str()) {
                        text_content = delta.to_string();
                        should_redact_and_forward = true;
                    }
                } else if event_type == "response.output_text.done" {
                    if let Some(text) = data.get("text").and_then(|t| t.as_str()) {
                        text_content = text.to_string();
                        should_redact_and_forward = true;
                    }
                }
            } else {
                // Handle Claude streaming format  
                if event_type == "content_block_delta" {
                    if let Some(delta) = data.get("delta") {
                        if let Some(text) = delta.get("text").and_then(|t| t.as_str()) {
                            text_content = text.to_string();
                            should_redact_and_forward = true;
                        }
                    }
                }
            }
            
            if !should_redact_and_forward {
            }
        }

        if should_redact_and_forward && !text_content.is_empty() {
            
            // Apply redaction with buffering (same as Node.js)
            let redacted_content = if is_openai_format && event_type == "response.output_text.done" {
                // For complete text events, apply redaction directly
                let redacted = redaction_engine.redact_sensitive_content(&text_content);
                Some(redacted)
            } else {
                // For streaming deltas, use buffering
                let result = Self::process_chunk_with_buffer(&text_content, request_id, redaction_engine, sse_accumulators).await;
                result
            };

            if let Some(redacted) = redacted_content {
                if let Some(mut data) = event_data_json {
                    if is_openai_format {
                        // Update OpenAI format
                        if event_type == "response.output_text.delta" {
                            data["delta"] = serde_json::Value::String(redacted);
                        } else if event_type == "response.output_text.done" {
                            data["text"] = serde_json::Value::String(redacted);
                        }
                    } else {
                        // Update Claude format
                        if let Some(delta) = data.get_mut("delta") {
                            delta["text"] = serde_json::Value::String(redacted);
                        }
                    }

                    return Some(format!("event: {}\ndata: {}", event_type, data));
                }
            } else {
                // Don't forward this event since we're buffering
                return None;
            }
        } else if event_type == "content_block_stop" && !is_openai_format {
            // Claude-specific: Flush any remaining buffer content
            if let Some(final_chunk) = Self::flush_buffer(request_id, redaction_engine, sse_accumulators).await {
                let final_event_data = serde_json::json!({
                    "type": "content_block_delta",
                    "index": 0,
                    "delta": {
                        "type": "text_delta",
                        "text": final_chunk
                    }
                });
                return Some(format!("event: content_block_delta\ndata: {}\n\nevent: content_block_stop\ndata: {}", 
                    final_event_data, event_data_json.unwrap_or(serde_json::Value::Null)));
            }
        } else if is_openai_format && (event_type == "response.completed" || event_data.contains("[DONE]")) {
            // OpenAI-specific: Handle end of stream and flush buffer
            if let Some(final_chunk) = Self::flush_buffer(request_id, redaction_engine, sse_accumulators).await {
                let final_data = serde_json::json!({
                    "type": "response.output_text.delta",
                    "delta": final_chunk
                });
                return Some(format!("event: response.output_text.delta\ndata: {}\n\n{}", 
                    final_data, event_data));
            }
        }

        // Forward all other events as-is
        Some(event_data.to_string())
    }

    async fn process_chunk_with_buffer(
        new_chunk: &str,
        request_id: u64,
        redaction_engine: &RedactionEngine,
        sse_accumulators: &Arc<RwLock<HashMap<u64, SseAccumulator>>>,
    ) -> Option<String> {
        let mut accumulators = sse_accumulators.write().await;
        if let Some(accumulator) = accumulators.get_mut(&request_id) {
            // Add new chunk to buffer
            accumulator.buffer.push_str(new_chunk);

            // Split by lines and process complete lines
            let buffer_copy = accumulator.buffer.clone();
            let mut lines: Vec<&str> = buffer_copy.split('\n').collect();
            
            // Keep the last (potentially incomplete) line in buffer (like Node.js pop())
            accumulator.buffer = lines.pop().unwrap_or("").to_string();
            
            // Process complete lines
            if !lines.is_empty() {
                let complete_lines = lines.join("\n") + "\n";
                let redacted = redaction_engine.redact_sensitive_content(&complete_lines);
                return Some(redacted);
            }
            
            // No complete lines yet, don't send anything
            return None;
        }
        None
    }

    async fn flush_buffer(
        request_id: u64,
        redaction_engine: &RedactionEngine,
        sse_accumulators: &Arc<RwLock<HashMap<u64, SseAccumulator>>>,
    ) -> Option<String> {
        let mut accumulators = sse_accumulators.write().await;
        if let Some(accumulator) = accumulators.get_mut(&request_id) {
            if accumulator.buffer.is_empty() {
                return None;
            }
            
            // Process remaining buffer content
            let remaining = accumulator.buffer.clone();
            accumulator.buffer.clear();
            
            let redacted = redaction_engine.redact_sensitive_content(&remaining);
            Some(redacted)
        } else {
            None
        }
    }
}

impl Clone for ProxyServer {
    fn clone(&self) -> Self {
        let https = HttpsConnector::new();
        let client = Client::builder().build::<_, hyper::Body>(https);
        
        Self {
            port: self.port,
            request_count: Arc::clone(&self.request_count),
            redaction_engine: self.redaction_engine.clone(),
            redaction_service: self.redaction_service.clone(),
            config_manager: Arc::clone(&self.config_manager),
            client,
            sse_content_accumulators: Arc::clone(&self.sse_content_accumulators),
            redis_client: self.redis_client.clone(),
        }
    }
}

impl Clone for RedactionEngine {
    fn clone(&self) -> Self {
        RedactionEngine::new()
    }
}
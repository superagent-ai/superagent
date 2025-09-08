use regex::Regex;
use serde::{Deserialize, Serialize};
use tracing::info;
use crate::{Error, Result};

#[derive(Debug, Serialize)]
struct RedactionRequest {
    inputs: String,
    parameters: serde_json::Value,
}

#[derive(Debug, Deserialize)]
struct RedactionResponse {
    label: String,
}

pub struct RedactionEngine {
    patterns: Vec<Regex>,
}

pub struct RedactionService {
    api_url: Option<String>,
    client: reqwest::Client,
}

impl RedactionEngine {
    pub fn new() -> Self {
        Self {
            patterns: initialize_sensitive_patterns(),
        }
    }

    pub fn redact_sensitive_content(&self, content: &str) -> String {
        let mut redacted_content = content.to_string();
        
        for pattern in &self.patterns {
            redacted_content = pattern.replace_all(&redacted_content, "REDACTED").to_string();
        }
        
        redacted_content
    }
}

impl Default for RedactionEngine {
    fn default() -> Self {
        Self::new()
    }
}

fn initialize_sensitive_patterns() -> Vec<Regex> {
    let patterns = vec![
        // ==== OPENAI & AI PROVIDERS ====
        r"sk-proj-[A-Za-z0-9_-]+",                // OpenAI project-scoped key
        r"dtn_[A-Za-z0-9_]+",                     // Daytona API key
        r"e2b_[A-Za-z0-9_]+",                     // E2B API key
        r"sk-ant-[A-Za-z0-9_-]+",                 // Anthropic API key
        r"sk-or-[A-Za-z0-9_-]+",                  // OpenAI org-scoped key
        r"sk-[A-Za-z0-9_-]+",                     // OpenAI generic secret
        r"gsk_[A-Za-z0-9_-]+",                    // Google Generative AI Studio key
        r"xai-[A-Za-z0-9_-]+",                    // xAI key

        // ==== GITHUB ====
        r"ghp_[A-Za-z0-9_]{36}",                      // GitHub PAT (classic)
        r"gho_[A-Za-z0-9_]{36}",                      // GitHub OAuth token
        r"ghs_[A-Za-z0-9_]{36}",                      // GitHub App server-to-server
        r"ghu_[A-Za-z0-9_]{36}",                      // GitHub App user-to-server
        r"ghr_[A-Za-z0-9_]{36}",                      // GitHub refresh token
        r"github_pat_[A-Za-z0-9_]{22}_[A-Za-z0-9_]{59}", // GitHub fine-grained PAT

        // ==== GITLAB ====
        r"glpat-[A-Za-z0-9_-]+",                  // GitLab PAT

        // ==== AWS ====
        r"AKIA[0-9A-Z]{16}",                          // AWS access key ID (long-lived)
        r"ASIA[0-9A-Z]{16}",                          // AWS temporary access key ID
        r"(?i)(aws_)?secret(access)?(_)?key\s*[:=]\s*[A-Za-z0-9/+=]{35,}", // AWS secret key

        // ==== GOOGLE API KEYS ====
        r"AIza[0-9A-Za-z-_]{35}",                     // Google API key (common AIza prefix)
        r"ya29\.[0-9A-Za-z-_]+",                      // Google OAuth access token
        r"GOCSPX-[A-Za-z0-9-_]+",                 // Google OAuth client secret

        // ==== SLACK ====
        r"xoxb-[A-Za-z0-9-]+-[A-Za-z0-9-]+-[A-Za-z0-9-]+", // Slack bot token
        r"xoxp-[A-Za-z0-9-]+-[A-Za-z0-9-]+-[A-Za-z0-9-]+", // Slack user token
        r"xoxa-[A-Za-z0-9-]+-[A-Za-z0-9-]+-[A-Za-z0-9-]+", // Slack workspace token
        r"xapp-1-[A-Z0-9-]+-[0-9]+-[A-Za-z0-9]+",          // Slack App level token

        // ==== STRIPE ====
        r"sk_live_[0-9a-zA-Z]+",                  // Stripe live secret key
        r"sk_test_[0-9a-zA-Z]+",                  // Stripe test secret key
        r"rk_live_[0-9a-zA-Z]+",                  // Stripe restricted key live
        r"rk_test_[0-9a-zA-Z]+",                  // Stripe restricted key test
        r"whsec_[A-Za-z0-9]+",                    // Stripe webhook secret

        // ==== TWILIO ====
        r"AC[0-9a-fA-F]{32}",                         // Twilio Account SID
        r"SK[0-9a-fA-F]{32}",                         // Twilio API Key SID

        // ==== SENDGRID / MAIL PROVIDERS ====
        r"SG\.[A-Za-z0-9_\-\.]{66}",                  // SendGrid API key
        r"key-[0-9a-f]{32}",                          // Mailgun API key (specific with 'key-' prefix)
        r"xkeysib-[A-Za-z0-9]{64}-[A-Za-z0-9]{16}",   // SendInBlue API key

        // ==== PAYMENT / CREDIT CARDS ====
        r"\b4[0-9]{12}(?:[0-9]{3})?\b",               // Visa (no spaces)
        r"\b4[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b", // Visa (with spaces/dashes)
        r"\b5[1-5][0-9]{14}\b",                       // MasterCard (no spaces)
        r"\b5[1-5][0-9]{2}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b", // MasterCard (with spaces/dashes)
        r"\b3[47][0-9]{13}\b",                        // AmEx (no spaces)
        r"\b3[47][0-9]{2}[\s-]?[0-9]{6}[\s-]?[0-9]{5}\b", // AmEx (with spaces/dashes)
        r"\b6(?:011|5[0-9]{2})[0-9]{12}\b",           // Discover (no spaces)
        r"\b6(?:011|5[0-9]{2})[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b", // Discover (with spaces/dashes)

        // ==== EMAIL ADDRESSES ====
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", // Email addresses

        // ==== DATABASE CONNECTION STRINGS - With passwords ====
        r"\bpostgres(?:ql)?://[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+/[A-Za-z0-9_.-]+",
        r"\bmongodb(?:\+srv)?://[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+/[A-Za-z0-9_.-]+",
        r"\bmysql://[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[^\s]+/[A-Za-z0-9_.-]+",
        r"\bredis://[A-Za-z0-9_%+.-]+:[^@\s]{1,}@[A-Za-z0-9_.:-]+",

        // ==== JWT TOKENS ====
        r"\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b", // JWT tokens

        // ==== SSH KEYS ====
        r"-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----[\s\S]+?-----END (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----",

        // ==== OTHER SPECIFIC API KEYS ====
        r"\bDD_API_KEY\b[^\n]{0,40}[:=]\s*[0-9a-f]{32}\b",         // Datadog
        r"\bDD_APP_KEY\b[^\n]{0,40}[:=]\s*[0-9a-f]{40}\b",         // Datadog
        r"NRAK-[A-Z0-9]{27}",                                        // New Relic ingest key
        r"NRAL-[A-Z0-9]{27}",                                        // New Relic license key
        r"shpat_[a-f0-9]{32}",                                       // Shopify private app access token
        r"shpss_[a-f0-9]{32}",                                       // Shopify shared secret
        r"npm_[A-Za-z0-9]{36}",                                      // npm access token
        r"\bpypi-AgENdGV\w{20,}\b",                                 // PyPI token
        r"EAA[A-Za-z0-9]+",                                      // Facebook access token
        r"\bBearer\s+AAAAAAAA[A-Za-z0-9%\-_]+\b",                 // Twitter bearer token
        r"lin_[A-Za-z0-9]{40}",                                      // Linear API key
        r"secret_[A-Za-z0-9]{43}",                                   // Notion token
        r"CFPAT-[A-Za-z0-9_-]+",                                // Contentful API token
        r"sdk-[A-Za-z0-9_-]+",                                  // LaunchDarkly SDK key (made more specific)
        r"mob-[A-Za-z0-9_-]+",                                  // LaunchDarkly Mobile key (made more specific)
        r"r8_[A-Za-z0-9]+",                                      // Replicate API token

        // ==== CRYPTO WALLETS ====
        r"\b0x[a-fA-F0-9]{40}\b",                                    // Ethereum address
        r"\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b",                     // Bitcoin (legacy)
        r"\bbc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{11,71}\b",       // Bitcoin Bech32

        // ==== SPECIFIC SECRET PATTERNS WITH CONTEXT ====
        r"(?i)\b(SECRET_KEY|API_SECRET|CLIENT_SECRET|PRIVATE_KEY)\b\s*[:=]\s*[A-Za-z0-9\-_.+/=]+",
        r"(?i)\b(password|passwd|pwd)\b\s*[:=]\s*[^\s]+",
        r"(?i)\b(api_key|apikey|api_token|access_token)\b\s*[:=]\s*[A-Za-z0-9\-_.]+",
    ];

    patterns.into_iter()
        .filter_map(|pattern| Regex::new(pattern).ok())
        .collect()
}

impl RedactionService {
    pub fn new(api_url: Option<String>) -> Self {
        info!("RedactionService initialized with API URL: {:?}", api_url);
        Self {
            api_url,
            client: reqwest::Client::new(),
        }
    }

    pub async fn redact_user_prompt(&self, prompt: &str) -> Result<String> {
        if let Some(url) = &self.api_url {
            let request = RedactionRequest {
                inputs: prompt.to_string(),
                parameters: serde_json::json!({}),
            };

            info!("Sending redaction request to: {}", url);
            info!("Request payload: {:?}", request);

            let response = self
                .client
                .post(url)
                .json(&request)
                .timeout(std::time::Duration::from_secs(30))
                .send()
                .await
                .map_err(|e| Error::Server(format!("Redaction API request failed: {}", e)))?;

            info!("Redaction API response status: {}", response.status());

            if !response.status().is_success() {
                return Err(Error::Server(format!(
                    "Redaction API returned error status: {}",
                    response.status()
                )));
            }

            let redaction_response: RedactionResponse = response
                .json()
                .await
                .map_err(|e| Error::Server(format!("Failed to parse redaction response: {}", e)))?;

            info!("Redaction response: {:?}", redaction_response);

            // Handle new API response format with label-based classification
            if redaction_response.label == "jailbreak" {
                info!("Jailbreak detected, blocking content");
                Ok("The user prompt was blocked due to containing potentially harmful content.".to_string())
            } else {
                info!("Content approved, returning original prompt");
                Ok(prompt.to_string()) // Return original prompt for benign content
            }
        } else {
            info!("No redaction URL configured, returning original prompt");
            // No redaction URL provided, return original prompt
            Ok(prompt.to_string())
        }
    }
}

impl Clone for RedactionService {
    fn clone(&self) -> Self {
        Self::new(self.api_url.clone())
    }
}
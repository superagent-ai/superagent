use clap::{Arg, Command};
use tokio::process::Command as TokioCommand;
use tracing::error;

use crate::{ProxyServer, Result};

pub async fn run_cli() -> Result<()> {
    let matches = Command::new("vibekit-proxy")
        .version("0.0.21")
        .about("VibeKit proxy server for secure API routing")
        .arg(
            Arg::new("port")
                .short('p')
                .long("port")
                .value_name("PORT")
                .help("Port to run on")
                .default_value("8080"),
        )
        .arg(
            Arg::new("config")
                .short('c')
                .long("config")
                .value_name("PATH")
                .help("Path to config.yaml file")
                .default_value("config.yaml"),
        )
        .subcommand(
            Command::new("start")
                .about("Start the proxy server")
                .arg(
                    Arg::new("port")
                        .short('p')
                        .long("port")
                        .value_name("PORT")
                        .help("Port to run on")
                        .default_value("8080"),
                )
                .arg(
                    Arg::new("config")
                        .short('c')
                        .long("config")
                        .value_name("PATH")
                        .help("Path to config.yaml file")
                        .default_value("config.yaml"),
                )
                .arg(
                    Arg::new("daemon")
                        .short('d')
                        .long("daemon")
                        .help("Run in background")
                        .action(clap::ArgAction::SetTrue),
                ),
        )
        .subcommand(
            Command::new("stop")
                .about("Stop the proxy server")
                .arg(
                    Arg::new("port")
                        .short('p')
                        .long("port")
                        .value_name("PORT")
                        .help("Port to stop")
                        .default_value("8080"),
                ),
        )
        .subcommand(
            Command::new("status")
                .about("Show proxy server status")
                .arg(
                    Arg::new("port")
                        .short('p')
                        .long("port")
                        .value_name("PORT")
                        .help("Port to check")
                        .default_value("8080"),
                ),
        )
        .get_matches();

    match matches.subcommand() {
        Some(("start", sub_matches)) => {
            let port: u16 = sub_matches
                .get_one::<String>("port")
                .unwrap()
                .parse()
                .unwrap_or_else(|_| {
                    // Check environment variable
                    std::env::var("PORT")
                        .ok()
                        .and_then(|p| p.parse().ok())
                        .unwrap_or(8080)
                });

            let config_path = sub_matches
                .get_one::<String>("config")
                .unwrap()
                .clone();

            let _daemon = sub_matches.get_flag("daemon");

            // Daemon mode (simplified)

            start_proxy_with_check(port, Some(config_path)).await?;
        }
        Some(("stop", sub_matches)) => {
            let port: u16 = sub_matches
                .get_one::<String>("port")
                .unwrap()
                .parse()
                .unwrap_or(8080);

            stop_proxy_on_port(port).await;
        }
        Some(("status", sub_matches)) => {
            let port: u16 = sub_matches
                .get_one::<String>("port")
                .unwrap()
                .parse()
                .unwrap_or(8080);

            show_proxy_status(port).await;
        }
        _ => {
            // Default command - start the proxy server
            let port: u16 = matches
                .get_one::<String>("port")
                .unwrap()
                .parse()
                .unwrap_or(8080);

            let config_path = matches
                .get_one::<String>("config")
                .unwrap()
                .clone();

            start_proxy_with_check(port, Some(config_path)).await?;
        }
    }

    Ok(())
}

async fn start_proxy_with_check(port: u16, config_path: Option<String>) -> Result<()> {
    use std::sync::Arc;
    use tokio::signal;
    
    let server = Arc::new(ProxyServer::new(port, config_path).await?);
    let server_clone = Arc::clone(&server);

    // Handle graceful shutdown
    tokio::spawn(async move {
        let _ = signal::ctrl_c().await;
        server_clone.stop().await;
    });

    server.start().await
}

async fn stop_proxy_on_port(port: u16) {
    // Kill processes using the port (Unix/Linux/macOS only)
    if let Ok(output) = TokioCommand::new("lsof")
        .arg("-ti")
        .arg(format!(":{}", port))
        .output()
        .await
    {
        let pids_str = String::from_utf8_lossy(&output.stdout);
        let pids: Vec<&str> = pids_str.trim().split('\n').filter(|s| !s.is_empty()).collect();

        if pids.is_empty() {
            return;
        }

        for pid_str in &pids {
            if let Ok(pid) = pid_str.parse::<i32>() {
                let _ = TokioCommand::new("kill")
                    .arg("-TERM")
                    .arg(pid.to_string())
                    .output()
                    .await;
            }
        }
    } else {
        error!("Failed to find processes on port {}", port);
    }
}

async fn show_proxy_status(port: u16) {
    println!("🌐 Proxy Server Status");
    println!("{}", "─".repeat(30));

    let running = is_port_in_use(port).await;
    println!("Port {}: {}", port, if running { "✅ RUNNING" } else { "❌ NOT RUNNING" });

    if running {
        // Try to get health check
        let health_url = format!("http://localhost:{}/health", port);
        match reqwest::get(&health_url).await {
            Ok(response) => {
                if response.status().is_success() {
                    if let Ok(data) = response.json::<serde_json::Value>().await {
                        if let Some(uptime) = data.get("uptime").and_then(|u| u.as_u64()) {
                            println!("Uptime: {}s", uptime);
                        }
                        if let Some(request_count) = data.get("requestCount").and_then(|r| r.as_u64()) {
                            println!("Requests: {}", request_count);
                        }
                    }
                } else {
                    println!("Health check: ❌ Failed");
                }
            }
            Err(_) => {
                println!("Health check: ❌ Failed");
            }
        }

        // Show process info
        if let Ok(output) = TokioCommand::new("lsof")
            .arg("-ti")
            .arg(format!(":{}", port))
            .output()
            .await
        {
            let pids_str = String::from_utf8_lossy(&output.stdout);
            let pids: Vec<&str> = pids_str.trim().split('\n').filter(|s| !s.is_empty()).collect();
            if !pids.is_empty() {
                println!("PIDs: {}", pids.join(", "));
            }
        }
    }
}

async fn is_port_in_use(port: u16) -> bool {
    let output = TokioCommand::new("lsof")
        .arg("-ti")
        .arg(format!(":{}", port))
        .output()
        .await;

    if let Ok(output) = output {
        !String::from_utf8_lossy(&output.stdout).trim().is_empty()
    } else {
        false
    }
}
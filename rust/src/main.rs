use tracing_subscriber;
use ai_firewall::{run_cli, Result};

#[tokio::main]
async fn main() -> Result<()> {
    // Configure structured JSON logging
    let log_level = std::env::var("LOG_LEVEL").unwrap_or_else(|_| "info".to_string());
    let env_filter = tracing_subscriber::EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new(&log_level));

    tracing_subscriber::fmt()
        .json()
        .with_env_filter(env_filter)
        .with_target(false)
        .with_current_span(false)
        .with_span_list(false)
        .init();

    run_cli().await
}
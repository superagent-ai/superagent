use serde::{Deserialize, Serialize};
use std::path::Path;
use tokio::fs;
use crate::{Error, Result};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModelConfig {
    pub model_name: String,
    pub provider: String,
    pub api_base: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DefaultConfig {
    pub provider: String,
    pub api_base: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub models: Option<Vec<ModelConfig>>,
    pub default: Option<DefaultConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResolvedModelConfig {
    pub provider: String,
    pub api_base: String,
    pub model_name: String,
}

pub struct ConfigManager {
    config: Option<Config>,
    config_path: String,
}

impl ConfigManager {
    pub fn new() -> Self {
        let config_path = Self::find_config_file();
        Self {
            config: None,
            config_path,
        }
    }

    pub fn new_with_path(config_path: Option<String>) -> Self {
        let config_path = config_path.unwrap_or_else(|| Self::find_config_file());
        Self {
            config: None,
            config_path,
        }
    }

    fn find_config_file() -> String {
        // Try multiple locations in order of preference
        let possible_paths = vec![
            // 1. Environment variable
            std::env::var("VIBEKIT_CONFIG").ok(),
            // 2. Current working directory
            Some("vibekit.yaml".to_string()),
            // 3. Parent directory (for rust/ subdirectory setup)
            Some("../vibekit.yaml".to_string()),
            // 4. Home directory
            dirs::home_dir().map(|home| home.join(".vibekit").join("vibekit.yaml").to_string_lossy().to_string()),
            // 5. System config directory
            Some("/etc/vibekit/vibekit.yaml".to_string()),
        ];

        for path_option in possible_paths {
            if let Some(path) = path_option {
                if Path::new(&path).exists() {
                    return path;
                }
            }
        }

        // Default fallback
        "vibekit.yaml".to_string()
    }

    pub async fn load_config(&mut self) -> Result<()> {
        if !Path::new(&self.config_path).exists() {
            return Err(Error::Config(format!("Config file not found at {}", self.config_path)));
        }

        let config_data = fs::read_to_string(&self.config_path).await?;
        self.config = Some(serde_yaml::from_str(&config_data)?);
        Ok(())
    }

    pub fn get_model_config(&self, model_name: &str) -> ResolvedModelConfig {
        if let Some(config) = &self.config {
            // Find model in config
            if let Some(models) = &config.models {
                if let Some(model_config) = models.iter().find(|m| m.model_name == model_name) {
                    return ResolvedModelConfig {
                        provider: model_config.provider.clone(),
                        api_base: model_config.api_base.clone(),
                        model_name: model_config.model_name.clone(),
                    };
                }
            }

            // Return default if model not found
            if let Some(default) = &config.default {
                return ResolvedModelConfig {
                    provider: default.provider.clone(),
                    api_base: default.api_base.clone(),
                    model_name: model_name.to_string(), // Keep original model name
                };
            }
        }

        // Ultimate fallback
        ResolvedModelConfig {
            provider: "anthropic".to_string(),
            api_base: "https://api.anthropic.com/".to_string(),
            model_name: model_name.to_string(),
        }
    }

    pub fn get_api_base_for_model(&self, model_name: &str) -> String {
        let config = self.get_model_config(model_name);
        config.api_base
    }

    pub fn is_provider(&self, model_name: &str, provider: &str) -> bool {
        let config = self.get_model_config(model_name);
        config.provider == provider
    }
}

impl Default for ConfigManager {
    fn default() -> Self {
        Self::new()
    }
}
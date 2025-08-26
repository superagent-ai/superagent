import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import logger from './logger.js';

class ConfigManager {
  constructor() {
    this.config = null;
    // Default to looking in the current working directory
    this.configPath = path.resolve(process.cwd(), 'vibekit.yaml');
  }

  async loadConfig(configPath = null) {
    // Update configPath if provided
    if (configPath) {
      if (path.isAbsolute(configPath)) {
        this.configPath = configPath;
      } else {
        // For relative paths, resolve from current working directory
        this.configPath = path.resolve(process.cwd(), configPath);
      }
    }
    
    try {
      if (await fs.pathExists(this.configPath)) {
        const configData = await fs.readFile(this.configPath, 'utf8');
        this.config = yaml.load(configData);
        return this.config;
      } else {
        throw new Error(`Config file not found at ${this.configPath}`);
      }
    } catch (error) {
      logger.error('Error loading config file', {
        event_type: 'config_load_error',
        config_path: this.configPath,
        error: error.message
      });
      throw error;
    }
  }

  getModelConfig(modelName) {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }

    // Find model in config
    const modelConfig = this.config.models?.find(m => m.model_name === modelName);
    
    if (modelConfig) {
      return {
        provider: modelConfig.provider,
        apiBase: modelConfig.api_base,
        modelName: modelConfig.model_name
      };
    }

    // Return default if model not found
    if (this.config.default) {
      return {
        provider: this.config.default.provider,
        apiBase: this.config.default.api_base,
        modelName: modelName // Keep original model name
      };
    }

    // Ultimate fallback - changed to OpenAI
    return {
      provider: 'openai',
      apiBase: 'https://api.openai.com/',
      modelName: modelName
    };
  }

  // Get API base for a model name
  getApiBaseForModel(modelName) {
    const config = this.getModelConfig(modelName);
    return config.apiBase;
  }

  // Check if model is from a specific provider
  isProvider(modelName, provider) {
    const config = this.getModelConfig(modelName);
    return config.provider === provider;
  }
}

// Export singleton instance
const configManager = new ConfigManager();
export default configManager;
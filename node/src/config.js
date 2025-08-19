import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

class ConfigManager {
  constructor() {
    this.config = null;
    this.configPath = path.join(process.cwd(), 'config.yaml');
  }

  async loadConfig() {
    try {
      if (await fs.pathExists(this.configPath)) {
        const configData = await fs.readFile(this.configPath, 'utf8');
        this.config = yaml.load(configData);
        return this.config;
      } else {
        throw new Error(`Config file not found at ${this.configPath}`);
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
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

    // Ultimate fallback
    return {
      provider: 'anthropic',
      apiBase: 'https://api.anthropic.com/',
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
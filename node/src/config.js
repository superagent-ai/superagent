import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ConfigManager {
  constructor() {
    this.config = null;
    // Default to looking in the project root (parent of src/)
    this.configPath = path.join(__dirname, '../..', 'vibekit.yaml');
  }

  async loadConfig(configPath = null) {
    // Update configPath if provided
    if (configPath) {
      if (path.isAbsolute(configPath)) {
        this.configPath = configPath;
      } else {
        // For relative paths like '../config.yaml', resolve from node/ directory to project root
        // __dirname is /path/to/project/node/src, so we need to go up two levels to get to project root
        this.configPath = path.resolve(__dirname, '../..', configPath.replace('../', ''));
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
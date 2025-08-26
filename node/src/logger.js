import { randomUUID } from 'crypto';

class StructuredLogger {
  constructor() {
    this.serviceName = 'ai-firewall-node';
    this.serviceVersion = '0.0.1';
    this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL || 'info');
  }

  parseLogLevel(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level.toLowerCase()] || 1;
  }

  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= this.logLevel;
  }

  createBaseLogEntry(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      version: this.serviceVersion,
      ...data
    };
  }

  debug(message, data = {}) {
    if (this.shouldLog('debug')) {
      console.log(JSON.stringify(this.createBaseLogEntry('debug', message, data)));
    }
  }

  info(message, data = {}) {
    if (this.shouldLog('info')) {
      console.log(JSON.stringify(this.createBaseLogEntry('info', message, data)));
    }
  }

  warn(message, data = {}) {
    if (this.shouldLog('warn')) {
      console.log(JSON.stringify(this.createBaseLogEntry('warn', message, data)));
    }
  }

  error(message, data = {}) {
    if (this.shouldLog('error')) {
      console.error(JSON.stringify(this.createBaseLogEntry('error', message, data)));
    }
  }

  // Log a complete request/response cycle
  logRequest(requestData) {
    this.info('Request processed', {
      event_type: 'request_processed',
      trace_id: requestData.trace_id || randomUUID(),
      request: {
        method: requestData.method,
        url: requestData.url,
        model: requestData.model,
        headers: requestData.headers || {},
        body_size_bytes: requestData.body_size_bytes || 0
      },
      response: {
        status: requestData.status,
        duration_ms: requestData.duration_ms,
        body_size_bytes: requestData.response_size_bytes || 0,
        is_sse: requestData.is_sse || false
      },
      redaction: {
        input_redacted: requestData.input_redacted || false,
        output_redacted: requestData.output_redacted || false,
        processing_time_ms: requestData.redaction_time_ms || 0
      },
      proxy: {
        target_url: requestData.target_url,
        model_routing: requestData.model_routing || false
      }
    });
  }

  // Generate a new trace ID
  generateTraceId() {
    return randomUUID();
  }

  // Log server startup
  logServerStart(port) {
    this.info('Server started', {
      event_type: 'server_start',
      port,
      service: this.serviceName,
      version: this.serviceVersion
    });
  }

  // Log server shutdown
  logServerStop() {
    this.info('Server stopping', {
      event_type: 'server_stop'
    });
  }

  // Log health check
  logHealthCheck() {
    this.debug('Health check requested', {
      event_type: 'health_check'
    });
  }
}

// Export singleton instance
const logger = new StructuredLogger();
export default logger;
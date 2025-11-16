const morgan = require('morgan');
const logger = require('../config/logger');

// Custom token for response time in ms
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '-';
  }
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(2);
});

// Custom format for logging
const morganFormat = ':method :url :status :response-time-ms ms - :res[content-length] bytes - :remote-addr';

// Skip logging for health check endpoints
const skip = (req, res) => {
  // Skip logging for successful health checks
  if (req.url === '/health' && res.statusCode < 400) {
    return true;
  }
  return false;
};

// Create morgan middleware
const requestLogger = morgan(morganFormat, {
  stream: logger.stream,
  skip
});

module.exports = requestLogger;

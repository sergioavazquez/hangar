const { createLogger, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = 'logs/nodejs';

// Create the log directory if it does not exist
if (!fs.existsSync('logs/nodejs')) {
  fs.mkdirSync('logs/nodejs');
}

const infoFilename = path.join(logDir, 'info.log');
const errorFilename = path.join(logDir, 'error.log');
// define the custom settings for each transport (file, console)
const options = {
  info: {
    level: 'info',
    filename: infoFilename,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  error: {
    level: 'error',
    filename: errorFilename,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  transports: [
    new transports.File(options.info),
    new transports.File(options.error),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;

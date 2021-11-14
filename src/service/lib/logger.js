"use strict";

const pino = require(`pino`);
const {Env} = require(`../../constants`);
const LOG_FILE = `./logs/api.log`;

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || (isDevMode ? `info` : `error`),
  transport: {
    target: isDevMode ? `pino-pretty` : `pino/file`,
    options: {
      destination: isDevMode ? process.stdout : LOG_FILE
    }
  }
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};

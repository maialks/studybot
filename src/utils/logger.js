const morgan = require('morgan');
const logger = require('./logger');

morgan.token('body', (req) => JSON.stringify(req.body));

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

module.exports = {
  requestLogger,
};

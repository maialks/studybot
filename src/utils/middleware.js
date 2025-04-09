const morgan = require('morgan');

morgan.token('body', (req) => JSON.stringify(req.body));

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

// const errorHandler = (error, request,response, next ) {
// }
module.exports = {
  requestLogger,
};

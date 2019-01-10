const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
// const pe = require('parse-error');
const cors = require('cors');
const v1 = require('./routes/v1');
const db = require('./db'); // Database
// const CONFIG = require('./config/config');

const app = express();
db.connect();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport
app.use(passport.initialize());

// Log Env
console.log('Environment (dev - prod - test):', process.env.NODE_ENV);

// CORS
app.use(cors());

// Router
app.use('/v1', v1);

app.use('/', (req, res) => {
  res.statusCode = 200; // send the appropriate status code
  res.json({ status: 'success', message: 'nothing to see here...' });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

process.on('unhandledRejection', error => {
  throw new Error(error);
});

process.on('uncaughtException', error => {
  // errorManagement.handler.handleError(error);
  // if(!errorManagement.handler.isTrustedError(error))
  throw new Error(error);
});

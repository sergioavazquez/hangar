const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const { asValue, asFunction, asClass, createContainer } = require('awilix');
const cors = require('cors');
const { Store } = require('meeseeks-js');
const v1 = require('./routes/v1');
const db = require('./db'); // Database
const CONFIG = require('./config/config');
const { eRe } = require('./utils/util.service');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  db().connect();
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport
app.use(passport.initialize());

const container = createContainer();
container.register({
  db: asFunction(db).singleton(),
  config: asValue(CONFIG),
  store: asClass(Store).singleton(),
});

app.locals.container = container;

// Log Env
console.log('Environment (dev - prod - test):', process.env.NODE_ENV);

// CORS
app.use(cors());

// Add success and error responses to avoid importing each time.
// app.use((req, res, next) => {
//   res.hangar = { eRe, sRe };
//   next();
// });

// Router
app.use('/v1', v1);

app.route('/').all((req, res) => {
  res.json({
    status: 'success',
    message: 'Hangar API root',
    data: { version_number: 'v0.0.1' },
  });
});

// catch 404 and forward to error handler
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  return eRe(res, err, 404);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    res.locals.error = err;
  } else {
    res.locals.error = {};
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('unhandledRejection', error => {
  throw new Error(error);
});

process.on('uncaughtException', error => {
  // errorManagement.handler.handleError(error);
  // if(!errorManagement.handler.isTrustedError(error))
  throw new Error(error);
});

module.exports = app;

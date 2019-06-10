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
const winston = require('./config/winston');
const { eRe } = require('./utils/util.service');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  db().connect();
}

app.use(logger('dev')); // Console logs
app.use(logger('combined', { stream: winston.stream })); // File logs
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

app.route('/fail').all(() => {
  throw new Error();
});

// catch 404 and forward to error handler
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  return eRe(res, err, 404);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    res.locals.error = err;
  } else {
    res.locals.error = {};
  }

  console.log('handled');
  // log errors to file
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next(err);
});

process.on('unhandledRejection', error => {
  console.log('unhandled rej');
  throw new Error(error);
});

process.on('uncaughtException', error => {
  console.log('unhandled err');
  // errorManagement.handler.handleError(error);
  // if(!errorManagement.handler.isTrustedError(error))
  throw new Error(error);
});

module.exports = app;

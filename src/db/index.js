const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const { cColors } = require('../utils/util.service');

/**
 * This service connects to MongoDB using Mongoose and hooks up all listeners.
 */
mongoose.Promise = global.Promise; // set mongo up to use promises
mongoose.set('useCreateIndex', true); // Avoids deprecation warning for ensureIndex()
mongoose.set('useNewUrlParser', true); // Avoids deprecation warning for urlParser

const mongoUri = `mongodb://${CONFIG.db_host}:${CONFIG.db_port}/${
  CONFIG.db_name
}`;

const { connection } = mongoose;

const options = {
  user: CONFIG.db_user,
  pass: CONFIG.db_password,
};

const connect = () =>
  mongoose
    .connect(
      mongoUri,
      options
    )
    .catch(err => {
      console.log(
        cColors.fgRed,
        `Can Not Connect to Mongo Server: ${mongoUri}`,
        cColors.reset
      );
      console.log(`Mongo connect error: ${err}`);
    });

const disconnect = () => {
  mongoose.disconnect().catch(err => {
    console.log(cColors.fgRed, 'Mongo disconnect failed', cColors.reset);
    console.log(`Mongo connect error: ${err}`);
  });
};

const dbErrorHandler = (error, reconnect) => {
  let knownError = false;
  // List known exceptions to handle
  if (
    error.message.match(/failed to connect/) &&
    error.message.match(/MongoNetworkError/)
  ) {
    knownError = true;
    console.log(
      cColors.fgCyan,
      '----- Waiting For Database -----',
      cColors.reset
    );
    setTimeout(reconnect, 5000);
  }

  if (!knownError) {
    console.log(cColors.fgYellow, '----- MongoDb Error -----', cColors.reset);
    console.log('error', error);
    console.log(cColors.fgYellow, '------- End Error -------', cColors.reset);
  }
};

connection.once('open', () => {
  console.log(
    cColors.fgCyan,
    `----- Connected to: ${mongoUri} ----`,
    cColors.reset
  );
});

connection.on('error', error => {
  dbErrorHandler(error, connect);
});

connection.on('disconnected', () => {
  console.log(
    cColors.fgCyan,
    '----- Database Disconnected -----',
    cColors.reset
  );
});

process.on('SIGINT', () => {
  connection.close(() => {
    console.log(
      cColors.fgCyan,
      '----- Closed DB due app closing -----',
      cColors.reset
    );
  });
});

const dbInterface = { connection, connect, disconnect };

module.exports = dbInterface;

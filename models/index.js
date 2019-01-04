const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const models = {};
const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const { dbErrorHandler, cColors } = require('../services/util.service');

if (CONFIG.db_host) {
  fs.readdirSync(__dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach(file => {
      const filename = file.split('.')[0];
      const modelName = filename.charAt(0).toUpperCase() + filename.slice(1);
      // eslint-disable-next-line
      models[modelName] = require(`./${file}`);
    });

  mongoose.Promise = global.Promise; // set mongo up to use promises
  mongoose.set('useCreateIndex', true); // Avoids deprecation warning for ensureIndex()
  mongoose.set('useNewUrlParser', true); // Avoids deprecation warning for urlParser

  const mongoUri = `mongodb://${CONFIG.db_host}:${CONFIG.db_port}/${
    CONFIG.db_name
  }`;

  const connectToDb = () => {
    mongoose.connect(mongoUri).catch(err => {
      console.log(
        cColors.fgRed,
        `Can Not Connect to Mongo Server: ${mongoUri}`,
        cColors.reset
      );
      console.log(`Mongo connect error: ${err}`);
    });
  };

  connectToDb();

  const db = mongoose.connection;
  module.exports = db;
  db.once('open', () => {
    console.log(
      cColors.fgCyan,
      `----- Connected to: ${mongoUri} ----`,
      cColors.reset
    );
  });
  db.on('error', error => {
    dbErrorHandler(error, connectToDb);
  });
  // End of Mongoose Setup
} else {
  console.log(
    cColors.fgMagenta,
    '---- Missing Database Config ----',
    cColors.reset
  );
  console.log(cColors.fgMagenta, 'Review .env file', cColors.reset);
}

module.exports = models;

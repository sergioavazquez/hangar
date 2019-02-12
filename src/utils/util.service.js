const cColors = {
  reset: '\x1b[0m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};
module.exports.cColors = cColors;

module.exports.eRe = function(res, err, code) {
  // Error Web Response
  let error = err;
  if (typeof err === 'object' && typeof err.message !== 'undefined') {
    error = err.message;
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({ success: false, error });
};

module.exports.sRe = function(res, data, code) {
  // Success Web Response
  let sendData = { success: true };

  if (typeof data === 'object') {
    sendData = Object.assign(data, sendData); // merge the objects
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json(sendData);
};

module.exports.tErr = function(errMessage, log) {
  // tErr stands for Throw Error
  if (log === true) {
    console.error(errMessage);
  }

  throw new Error(errMessage);
};

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

/**
 * This is basically what await-to-js does:
    export default function to(promise) {
        return promise.then(data => {
            return [null, data];
        })
        .catch(err => [err]);
    }
*/

module.exports.to = function(promise) {
  return promise.then(data => [null, data]).catch(err => [err]);
};

// function to(promise) {
//   return promise.then(data => {
//       return [null, data];
//   })
//   .catch(err => [err]);
// }

// module.exports.to = async promise => {
//   const [err, res] = await to(promise);
//   if (err) return [err];
//   // if (err) return [pe(err)];

//   return [null, res];
// };

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

module.exports.chain = (promises, cb) => {
  promises
    .reduce(async (previousPromises, next) => {
      await previousPromises;
      return next;
    }, Promise.resolve())
    .then(() => {
      cb();
    })
    .catch(e => {
      console.log('chain promises failed.', e);
    });
};

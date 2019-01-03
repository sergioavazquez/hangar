const { to } = require('await-to-js');
const pe = require('parse-error');

const cColors = {
  reset:'\x1b[0m',
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
  bgWhite: '\x1b[47m'
}
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
module.exports.to = async (promise) => {
  let err, res;
  [err, res] = await to(promise);
  if (err) return [pe(err)];

  return [null, res];
};

module.exports.eRe = function (res, err, code) { // Error Web Response
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({ success: false, error: err });
};

module.exports.sRe = function (res, data, code) { // Success Web Response
  let send_data = { success: true };

  if (typeof data == 'object') {
    send_data = Object.assign(data, send_data);//merge the objects
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json(send_data);
};

module.exports.tErr = function (err_message, log) { // tErr stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }

  throw new Error(err_message);
};

module.exports.dbErrorHandler = function(error, reconnect){
  let knownError = false;

  if(error.message.match(/failed to connect/) && error.message.match(/MongoNetworkError/))
  {
    knownError = true;
    console.log(cColors.fgCyan, '----- Waiting For Database -----', cColors.reset);
    setTimeout(reconnect, 5000);
  }

  if( !knownError ) {
    console.log(cColors.fgYellow, '----- MongoDb Error -----', cColors.reset);
    console.log("error", error);
    console.log(cColors.fgYellow, '------- End Error -------', cColors.reset);
  }
};

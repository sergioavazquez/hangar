const validator = require('validator');
const { to } = require('meeseeks-js');
const User = require('./user.model');
const { tErr } = require('../../utils/util.service');
const CONFIG = require('../../config/config');

const getUniqueKeyFromBody = function(body) {
  const authUniqueKey = CONFIG.auth_unique_key;
  let uniqueKey;
  if (body) {
    // eslint-disable-next-line
    uniqueKey = body[authUniqueKey];
  }

  return uniqueKey;
};
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function(userInfo) {
  const authInfo = {};
  authInfo.status = 'create';
  authInfo.method = CONFIG.auth_unique_key;

  const uniqueKey = getUniqueKeyFromBody(userInfo);
  if (!uniqueKey) tErr(`Missing method ${authInfo.method}.`);
  // Email validation
  if (authInfo.method === 'email') {
    if (validator.isEmail(uniqueKey)) {
      authInfo.email = uniqueKey;
      const newUser = { ...userInfo, ...authInfo };
      const [err, user] = await to(User.create(newUser));
      if (err) tErr('User email is already registered.');
      return user;
    }
  }

  tErr(`${uniqueKey} is not a valid ${authInfo.method}.`);
  return null;
};
module.exports.createUser = createUser;

const authUser = async function(userInfo) {
  // returns token
  const authInfo = {};
  authInfo.status = 'login';
  authInfo.method = CONFIG.auth_unique_key;
  const uniqueKey = getUniqueKeyFromBody(userInfo);

  if (!uniqueKey) tErr(`${authInfo.method} is required to login.`);

  if (!userInfo.password) tErr('Please enter a password to login');

  let user;
  let err;
  if (authInfo.method === 'email') {
    if (validator.isEmail(uniqueKey)) {
      [err, user] = await to(User.findOne({ email: uniqueKey }));
      if (err) tErr(err.message);
    }
  }
  if (!user) tErr('User not registered');

  [err, user] = await to(user.comparePassword(userInfo.password));

  if (err) tErr(err.message);

  return user;
};
module.exports.authUser = authUser;

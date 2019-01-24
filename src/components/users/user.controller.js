// const User = require('./user.model');
const authService = require('./auth.service');
const { to, eRe, sRe } = require('../../utils/util.service');

const create = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { body } = req;

  // unique field for user is checked in authService
  if (!body.password) {
    return eRe(res, 'Please enter a password to register.');
  }

  const [err, user] = await to(authService.createUser(body));

  if (err) return eRe(res, err, 422);
  return sRe(
    res,
    {
      message: 'Successfully created new user.',
      user: user.toWeb(),
      token: user.getJWT(),
    },
    201
  );
};
module.exports.create = create;

const get = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { user } = req;

  return sRe(res, { user: user.toWeb() });
};
module.exports.get = get;

/**
 * Just an example to populate user virtuals.
 */
// const get = async function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   const { user } = req;
//   const [err, result] = await to(
//     User.findOne({ _id: user.id }).populate('notes')
//   );
//   if (err) return eRe(res, err, 422);
//   return sRe(res, { user: result.toWeb() });
// };
// module.exports.get = get;

const update = async function(req, res) {
  let error;
  const { user, body } = req;
  user.set(body);

  const [err, updatedUser] = await to(user.save());
  if (err) {
    console.log(err, user);

    if (err.message.includes('E11000')) {
      if (err.message.includes('email')) {
        error = 'This email address is already in use';
      } else {
        error = 'Duplicate Key Entry';
      }
    }

    return eRe(res, error);
  }
  return sRe(res, { user: updatedUser.toWeb() });
};
module.exports.update = update;

const remove = async function(req, res) {
  const { user } = req;
  const [err] = await to(user.destroy());
  if (err) return eRe(res, 'An error occured trying to delete user');

  return sRe(res, { message: 'Deleted User' }, 204);
};
module.exports.remove = remove;

const login = async function(req, res) {
  const { body } = req;

  const [err, user] = await to(authService.authUser(body));
  if (err) return eRe(res, err, 422);

  return sRe(res, { token: user.getJWT(), user: user.toWeb() });
};
module.exports.login = login;

const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../models');
const CONFIG = require('../config/config');
const { to } = require('../services/util.service');

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwt_encryption;

  passport.use(
    new Strategy(opts, async (jwtPayload, done) => {
      const [err, user] = await to(User.findById(jwtPayload.user_id));
      if (err) return done(err, false);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
  );
};

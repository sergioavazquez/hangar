const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcryptP = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const validate = require('mongoose-validator');
const { to } = require('meeseeks-js');
const { tErr } = require('../../utils/util.service');
const CONFIG = require('../../config/config');

const UserSchema = mongoose.Schema(
  {
    first: { type: String },
    last: { type: String },
    phone: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true, // sparse is because now we have two possible unique keys that are optional
      validate: [
        validate({
          validator: 'isNumeric',
          arguments: [7, 20],
          message: 'Not a valid phone number.',
        }),
      ],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      validate: [
        validate({
          validator: 'isEmail',
          message: 'Not a valid email.',
        }),
      ],
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'users.user',
  justOne: false,
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

UserSchema.pre('save', async function (next) {
  let result;
  if (this.isModified('password') || this.isNew) {
    const [err, salt] = await to(bcrypt.genSalt(10));
    if (err) tErr(err.message, true);

    const [err2, hash] = await to(bcrypt.hash(this.password, salt));
    if (err2) tErr(err.message, true);

    this.password = hash;
  } else {
    result = next();
  }
  return result;
});

UserSchema.methods.comparePassword = async function (pw) {
  if (!this.password) tErr('password not set');

  const [err, pass] = await to(bcryptP.compare(pw, this.password));
  if (err) tErr(err);

  if (!pass) tErr('invalid password');

  return this;
};

UserSchema.virtual('full_name').get(function () {
  // now you can treat as if this was a property instead of a function
  if (!this.first) return null;
  if (!this.last) return this.first;

  return `${this.first} ${this.last}`;
});

UserSchema.methods.getJWT = function () {
  let expirationTime = 10000; // default in seconds
  if (typeof CONFIG.jwt_expiration === 'number') {
    expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  }
  if (typeof CONFIG.jwt_expiration === 'string') {
    expirationTime = CONFIG.jwt_expiration;
  }
  const token = jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, {
    expiresIn: expirationTime,
  });
  return `Bearer ${token}`;
};

UserSchema.methods.toWeb = function () {
  const json = this.toJSON();
  delete json.password;
  return json;
};

module.exports = mongoose.model('User', UserSchema);

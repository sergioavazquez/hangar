const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const Note              = require('./note.model');
const validate          = require('mongoose-validator');
const {tErr, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let UserSchema = mongoose.Schema({
    first:      {type:String},
    last:       {type:String},
    phone:	    {type:String, lowercase:true, trim: true, index: true, unique: true, sparse: true,//sparse is because now we have two possible unique keys that are optional
        validate:[validate({
            validator: 'isNumeric',
            arguments: [7, 20],
            message: 'Not a valid phone number.',
        })]
    },
    email: {type:String, lowercase:true, trim: true, index: true, unique: true, sparse: true,
            validate:[validate({
                validator: 'isEmail',
                message: 'Not a valid email.',
            }),]
    },
    password:   {type:String},

}, {timestamps: true});

UserSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'users.user',
    justOne: false,
});

UserSchema.set('toJSON', { virtuals: true })

UserSchema.pre('save', async function(next){

    if(this.isModified('password') || this.isNew){

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) tErr(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if(err) tErr(err.message, true);

        this.password = hash;

    } else{
        return next();
    }
})

UserSchema.methods.comparePassword = async function(pw){
    let err, pass;
    if(!this.password) tErr('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if(err) tErr(err);

    if(!pass) tErr('invalid password');

    return this;
}

UserSchema.methods.getNotes = async function(){
    let err, notes;
    [err, notes] = await to(Note.find({'users.user':this._id}));
    if(err) tErr('err getting notes');
    return notes;
}

UserSchema.virtual('full_name').set(function (name) {
    var split = name.split(' ');
    this.first = split[0];
    this.last = split[1];
});

UserSchema.virtual('full_name').get(function () { //now you can treat as if this was a property instead of a function
    if(!this.first) return null;
    if(!this.last) return this.first;

    return this.first + ' ' + this.last;
});

UserSchema.methods.getJWT = function(){
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer "+jwt.sign({user_id:this._id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
};

UserSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    return json;
};

module.exports = mongoose.model('User', UserSchema);



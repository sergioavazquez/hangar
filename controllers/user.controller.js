const { User }      = require('../models');
const authService   = require('../services/auth.service');
const { to, eRe, sRe }  = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    console.log(body);
    if(!body.unique_key && !body.email && !body.phone){
        return eRe(res, 'Please enter an email or phone number to register.');
    } else if(!body.password){
        return eRe(res, 'Please enter a password to register.');
    }else{
        let err, user;

        [err, user] = await to(authService.createUser(body));

        if(err) return eRe(res, err, 422);
        return sRe(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;

    return sRe(res, {user:user.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        console.log(err, user);

        if(err.message.includes('E11000')){
            if(err.message.includes('phone')){
                err = 'This phone number is already in use';
            } else if(err.message.includes('email')){
                err = 'This email address is already in use';
            }else{
                err = 'Duplicate Key Entry';
            }
        }

        return eRe(res, err);
    }
    return sRe(res, {message :'Updated User: '+user.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return eRe(res, 'error occured trying to delete user');

    return sRe(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return eRe(res, err, 422);

    return sRe(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;
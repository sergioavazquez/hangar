const Note 			    = require('../models/note.model');
const { to, eRe, sRe } = require('../services/util.service');

let note = async function (req, res, next) {
    let note_id, err, note;
    note_id = req.params.note_id;

    [err, note] = await to(Note.findOne({_id:note_id}));
    if(err) return eRe(res,"err finding note");

    if(!note) return eRe(res, "Note not found with id: "+note_id);
    let user, users_array;
    user = req.user;
    users_array = note.users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return eRe(res, "User does not have permission to read app with id: "+app_id);

    req.note = note;
    next();
}
module.exports.note = note;
const { Note } = require('../models');
const { to, eRe, sRe } = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, note;
    let user = req.user;

    let note_info = req.body;
    note_info.users = [{user:user._id}];

    [err, note] = await to(Note.create(note_info));
    if(err) return eRe(res, err, 422);

    return sRe(res,{note:note.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    let err, notes;
    [err, notes] = await to(user.getNotes());

    let notes_json = []
    for (let i in notes){
        let note = notes[i];
        notes_json.push(note.toWeb())
    }
    return sRe(res, {notes: notes_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let note = req.note;
    return sRe(res, {note:note.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, note, data;
    note = req.user;
    data = req.body;
    note.set(data);

    [err, note] = await to(note.save());
    if(err){
        return eRe(res, err);
    }
    return sRe(res, {note:note.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let note, err;
    note = req.note;

    [err, note] = await to(note.remove());
    if(err) return eRe(res, 'error occured trying to delete the note');

    return sRe(res, {message:'Deleted note'}, 204);
}
module.exports.remove = remove;
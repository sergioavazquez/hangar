const { to } = require('meeseeks-js');
const Note = require('./note.model');
const { eRe, sRe } = require('../../utils/util.service');

const create = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { user } = req;

  const noteInfo = req.body;
  noteInfo.users = [{ user: user._id }];

  const [err, note] = await to(Note.create(noteInfo));
  if (err) return eRe(res, err, 422);

  return sRe(res, { note: note.toWeb() }, 201);
};
module.exports.create = create;

const getAll = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { user } = req;

  const [err, notes] = await to(Note.find({ 'users.user': user._id }));
  if (err) return eRe(res, err, 422);

  const notesJson = notes.map(note => note.toWeb());

  return sRe(res, { notes: notesJson });
};
module.exports.getAll = getAll;

const get = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { note } = req;
  return sRe(res, { note: note.toWeb() });
};
module.exports.get = get;

const update = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { body, note } = req;
  note.set(body);

  const [err, updatedNote] = await to(note.save());
  if (err) {
    return eRe(res, err);
  }
  return sRe(res, { note: updatedNote.toWeb() });
};
module.exports.update = update;

const remove = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { note } = req;

  const [err] = await to(note.remove());
  if (err) return eRe(res, 'An error occured trying to delete the note');

  return sRe(res, { message: 'Note deleted' }, 204);
};
module.exports.remove = remove;

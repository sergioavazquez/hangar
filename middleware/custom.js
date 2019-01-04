const Note = require('../models/note.model');
const { to, eRe } = require('../services/util.service');

// --eslint-disable-next-line consistent-return
const noteMiddleware = async function(req, res, next) {
  const noteId = req.params.note_id;

  const [err, note] = await to(Note.findOne({ _id: noteId }));
  if (err) return eRe(res, 'Error finding resource', 400);

  if (!note) return eRe(res, `Resource not found`, 404);

  const { user } = req;
  const usersArray = note.users.map(obj => String(obj.user));

  if (!usersArray.includes(String(user._id)))
    return eRe(
      res,
      `User does not have permission to read note with id: ${noteId}`
    );

  req.note = note;
  next();
  return null;
};
module.exports.note = noteMiddleware;

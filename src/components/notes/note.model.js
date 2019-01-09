const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema(
  {
    title: { type: String },
    body: { type: String },
    users: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        permissions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

NoteSchema.methods.toWeb = function() {
  const json = this.toJSON();
  json.id = this._id;
  return json;
};

module.exports = mongoose.model('Note', NoteSchema);

const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

let NoteSchema = mongoose.Schema({
    title: {type:String},
    body: {type:String},
    users:  [ {user:{type : mongoose.Schema.ObjectId, ref : 'User'}, permissions:[{type:String}]} ],
}, {timestamps: true});

NoteSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

module.exports = mongoose.model('Note', NoteSchema);


const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const NoteController = require('../controllers/note.controller');
const HomeController 	= require('../controllers/home.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v0.0.1"}})
});

router.post(    '/users',           UserController.create);                                                    // C
router.get(     '/users',           passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post(    '/users/login',     UserController.login);

router.post(    '/notes',           passport.authenticate('jwt', {session:false}), NoteController.create);               // C
router.get(     '/notes',           passport.authenticate('jwt', {session:false}), NoteController.getAll);               // R

router.get(     '/notes/:note_id',  passport.authenticate('jwt', {session:false}), custom.note, NoteController.get);     // R
router.put(     '/notes/:note_id',  passport.authenticate('jwt', {session:false}), custom.note, NoteController.update);  // U
router.delete(  '/notes/:note_id',  passport.authenticate('jwt', {session:false}), custom.note, NoteController.remove);  // D

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
// router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
// router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;

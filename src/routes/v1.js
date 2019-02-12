const express = require('express');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
// Controllers
const UserController = require('../components/users/user.controller');
const NoteController = require('../components/notes/note.controller');
const HomeController = require('../controllers/home.controller');
// Middleware
const appendJwtStrategyTo = require('../components/users/passport.middleware');
const noteMiddleware = require('../components/notes/note.middleware');
// Docs
const swaggerDocument = require('../docs/v1.json');

// Append passport strategy.
appendJwtStrategyTo(passport);

const router = express.Router();
// Home
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hangar API root',
    data: { version_number: 'v0.0.1' },
  });
});
// Users
router.post('/users', UserController.create);
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  UserController.get
);
router.put(
  '/users',
  passport.authenticate('jwt', { session: false }),
  UserController.update
);
router.delete(
  '/users',
  passport.authenticate('jwt', { session: false }),
  UserController.remove
);
router.post('/users/login', UserController.login);

// Notes
router.post(
  '/notes',
  passport.authenticate('jwt', { session: false }),
  NoteController.create
);
router.get(
  '/notes',
  passport.authenticate('jwt', { session: false }),
  NoteController.getAll
);

router.get(
  '/notes/:note_id',
  passport.authenticate('jwt', { session: false }),
  noteMiddleware.checkUp,
  NoteController.get
);
router.put(
  '/notes/:note_id',
  passport.authenticate('jwt', { session: false }),
  noteMiddleware.checkUp,
  NoteController.update
);
router.delete(
  '/notes/:note_id',
  passport.authenticate('jwt', { session: false }),
  noteMiddleware.checkUp,
  NoteController.remove
);

router.get(
  '/dash',
  passport.authenticate('jwt', { session: false }),
  HomeController.Dashboard
);

// -------------- API Documentation ----------------
const customoptions = {
  customCss: '.swagger-ui .topbar { display: none }',
};

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, customoptions)
);

module.exports = router;

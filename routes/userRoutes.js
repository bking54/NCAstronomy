const express = require('express');
const controller = require('../controllers/userController');
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter')

const router = express.Router();

//Login page
router.get('/index', auth.isGuest, controller.index);

//Logout
router.get('/logout', auth.isLoggedIn, controller.logout);

//New user form
router.get('/new', auth.isGuest, controller.create);

//View profile
router.get('/profile', auth.isLoggedIn, controller.profile);

//Post New user
router.post('/new', auth.isGuest, controller.new);

//Login
router.post('/login', rateLimiter.logInLimiter, auth.isGuest, controller.login);

module.exports = router;
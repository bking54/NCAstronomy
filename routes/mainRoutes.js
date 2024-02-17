const express = require('express');
const mainController = require('../controllers/mainController');

const router = express.Router();

//GET requests
router.get('/', mainController.index);

router.get('/about', mainController.about);

router.get('/contact', mainController.contact);

module.exports = router;

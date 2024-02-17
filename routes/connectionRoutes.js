const express = require('express');
const connectionController = require('../controllers/connectionController');
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validator');

const router = express.Router();

//GET requests

//URL: connections/
//Render the connections page
router.get('/', connectionController.index);

//URL: connections/new
//Render the new connection page
router.get('/new', auth.isLoggedIn, connectionController.new);

//URL: connections/:id
//Render the unique page of this connection
router.get('/:id', validator.validateId, connectionController.show);

//URL: connections/:id/edit
//Render the edit connection page
router.get('/:id/edit', auth.isLoggedIn, validator.validateId, auth.isAuthor, connectionController.edit);

//POST requests

//URL: connections/
//Save new connection & redirect to connections page
router.post('/', auth.isLoggedIn, validator.validateConnection, connectionController.create);

//URL: connections/:id/rsvp
//Save a new RSVP relationship
router.post('/:id/rsvp', auth.isLoggedIn, validator.validateId, auth.isNotAuthor, connectionController.rsvp);

//PUT requests

//URL: connections/:id
//Update a connection by id
router.put('/:id', auth.isLoggedIn, validator.validateId, validator.validateConnection, auth.isAuthor, connectionController.update);

//DELETE requests

//URL: connections/:id
//Delete a connection by id
router.delete('/:id', auth.isLoggedIn, validator.validateId, auth.isAuthor, connectionController.delete);

module.exports = router;
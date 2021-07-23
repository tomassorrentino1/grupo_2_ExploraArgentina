const express = require('express');
const router = express.Router();

let usersController = require('../controllers/usersController');

// Register

router.get('/register', usersController.register);


// Login

router.get('/login', usersController.login);

module.exports = router;
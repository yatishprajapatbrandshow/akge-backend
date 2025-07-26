const express = require('express');
const router = express.Router();

// import Controllers
const { adminController } = require('../controller')

// Define Routes
router.post('/',adminController.auth);
router.get('/logout',adminController.logout);
router.post('/register',adminController.register);


module.exports = router

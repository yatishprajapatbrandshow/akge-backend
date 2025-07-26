const express = require('express');
const router = express.Router();

// import Controllers
const { circularController } = require('../controller')

// Define Routes
router.post('/add',circularController.addCircular);
router.post('/update',circularController.updateCircular);
router.get('/getAll',circularController.getAllCircular);
router.get('/get',circularController.getCircular);
router.get('/search',circularController.searchCircular);


module.exports = router

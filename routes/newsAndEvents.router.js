const express = require('express');
const router = express.Router();

// import Controllers
const { newsAndEventsController } = require('../controller')

// Define Routes
router.post('/add',newsAndEventsController.addNewsAndEvents);
router.get('/getAll',newsAndEventsController.getAllNewsAndEvents);
router.get('/get',newsAndEventsController.getNewsAndEvent);


module.exports = router

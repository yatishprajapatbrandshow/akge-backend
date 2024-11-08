const express = require('express');
const router = express.Router();

// import Controllers
const { newsAndEventsController } = require('../controller')

// Define Routes
router.post('/add',newsAndEventsController.addNewsAndEvents);
router.post('/update',newsAndEventsController.updateNewsAndEvents);
router.get('/getAll',newsAndEventsController.getAllNewsAndEvents);
router.get('/get',newsAndEventsController.getNewsAndEvent);
router.get('/search',newsAndEventsController.searchNewsAndEvents);


module.exports = router

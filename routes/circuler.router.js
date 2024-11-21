const express = require('express');
const router = express.Router();

// import Controllers
const { circulerController } = require('../controller')

// Define Routes
router.post('/add',circulerController.addCirculer);
router.post('/update',circulerController.updateCirculer);
router.get('/getAll',circulerController.getAllCirculer);
router.get('/get',circulerController.getCirculer);
router.get('/search',circulerController.searchCirculer);


module.exports = router

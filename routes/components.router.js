const express = require('express');
const router = express.Router();
const { componentsController } = require('../controller')
router.post('/components', componentsController.createComponent);
router.get('/components', componentsController.getAllComponents);
router.get('/components/:id', componentsController.getComponentById);
router.put('/components/:id', componentsController.updateComponent);
router.delete('/components/:id', componentsController.deleteComponent);

module.exports = router;

const express = require('express');
const { slugController } = require('../controller');

const router = express.Router();

// Route to create a new slug
// router.post('/', slugController.insert);

// Route to create a new slug
router.post('/add', slugController.addPageInactive);
router.post('/update', slugController.update);

// // Route to get all slugs
router.post('/getParents', slugController.getParent);

// // Route to get all slugs
router.post('/getList', slugController.getList);
    

// // Route to get a slug by ID
// router.get('/:id', slugController.getSlugById);

// // Route to update a slug by ID
// router.put('/:id', slugController.updateSlug);

// // Route to delete a slug by ID
// router.delete('/:id', slugController.deleteSlug);

module.exports = router;

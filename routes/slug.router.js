const express = require("express");
const { slugController } = require("../controller");

const router = express.Router();

// Route to create a new slug
// router.post('/', slugController.insert);

// Route to create a new slug
router.post("/add", slugController.addPageInactive);
router.post("/update", slugController.update);

// // Route to get all slugs
router.post("/getParents", slugController.getParent);

// // Route to get all slugs
router.post("/getList", slugController.getList);

// // Route to get all slugs
router.get("/getbytype", slugController.getSlugByType);

// // Route to get all slugs
router.get("/getbyid", slugController.getById);

router.get('/', slugController.getBySlug)

module.exports = router;

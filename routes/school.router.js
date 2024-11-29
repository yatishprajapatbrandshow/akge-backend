const express = require("express");
const router = express.Router();

// import Controllers
const { schoolController } = require("../controller");

// Define Routes
router.post("/add", schoolController.create);
router.post("/update", schoolController.update);
router.get("/list", schoolController.findAll);
router.get("/get-by-id", schoolController.findById);
router.get("/search", schoolController.search);
router.get("/delete", schoolController.deleteSchool);

module.exports = router;

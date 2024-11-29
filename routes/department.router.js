const express = require("express");
const router = express.Router();

// import Controllers
const { departmentController } = require("../controller");

// Define Routes
router.post("/add", departmentController.create);
router.post("/update", departmentController.update);
router.get("/list", departmentController.findAll);
router.get("/get-by-id", departmentController.findById);
router.get("/get-by-school-id", departmentController.getbySchool);
router.get("/search", departmentController.search);

module.exports = router;

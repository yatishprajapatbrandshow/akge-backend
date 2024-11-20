const express = require("express");
const router = express.Router();

// import Controllers
const { metaController } = require("../controller");

// Define Routes
router.get("/get", metaController.getMeta);
router.get("/list", metaController.list);
router.post("/add", metaController.addMeta);

module.exports = router;

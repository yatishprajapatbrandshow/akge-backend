const express = require("express");
const router = express.Router();

// import Controllers
const { announcementController } = require("../controller");

// Define Routes
router.post("/", announcementController.addAnnouncement);
router.post("/update", announcementController.updateAnnouncement);

module.exports = router;

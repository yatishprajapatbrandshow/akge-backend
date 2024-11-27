const express = require("express");
const router = express.Router();

// import Controllers
const { highlightBannerController } = require("../controller");

// Define Routes
router.post("/", highlightBannerController.addHighlightBanner);
router.post("/update", highlightBannerController.updateHighlightBanner);
router.post("/delete", highlightBannerController.deleteHighlightBanner);
router.get("/", highlightBannerController.getHighlightBannerById);
router.get("/page-id", highlightBannerController.getHighlightBannerByPageId);

module.exports = router;

const express = require("express");
const router = express.Router();
const  {reviewController } = require("../controller");

router.post("/create", reviewController.createReview);        // Create Review
router.get("/get-all", reviewController.getAllReviews);        // Get All Reviews
router.get("/:id", reviewController.getReviewById);     // Get Single Review
router.put("/:id", reviewController.updateReview);      // Update Review
router.delete("/:id", reviewController.deleteReview);   // Soft Delete Review

module.exports = router;

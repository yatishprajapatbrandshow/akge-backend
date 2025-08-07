const { Review } = require("../models");

// Create Review (with page_id)
const createReview = async (req, res) => {
  try {
    const { name, course, company_name, description, image, page_id } = req.body;

    const review = new Review({
      name,
      course,
      company_name,
      description,
      image,
      page_id: page_id || null // Make page_id optional
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review created", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Reviews (with optional page_id filter)
const getAllReviews = async (req, res) => {
  try {
    const { page_id } = req.query;
    const filter = { deleteflag: false };
    
    if (page_id) {
      filter.page_id = page_id;
    }

    const reviews = await Review.find(filter);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Reviews by Page ID
const getReviewsByPageId = async (req, res) => {
  try {
    const { page_id } = req.params;
    const reviews = await Review.find({ 
      page_id,
      deleteflag: false 
    });
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Review
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review updated", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { deleteflag: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted (soft)", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByPageId,
  getReviewById,
  updateReview,
  deleteReview,
};
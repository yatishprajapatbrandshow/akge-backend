// controllers/testimonial.controller.js
const { Testimonial } = require("../models");

// Create Testimonial (with page_id)
const createTestimonial = async (req, res) => {
  try {
    const { name, rating, position, description, company_name, company_city, company_country, image, page_id } = req.body;

    const testimonial = new Testimonial({
      name,
      rating,
      position,
      description,
      company_name,
      company_city,
      company_country,
      image,
      page_id: page_id || null // Make page_id optional
    });

    await testimonial.save();
    res.status(201).json({ success: true, message: "Testimonial created", data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Testimonials (with optional page_id filter)
const getAllTestimonials = async (req, res) => {
  try {
    const { page_id } = req.query;
    const filter = { deleteflag: false };
    
    if (page_id) {
      filter.page_id = page_id;
    }

    const testimonials = await Testimonial.find(filter);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Testimonials by Page ID
const getTestimonialsByPageId = async (req, res) => {
  try {
    const { page_id } = req.params;
    const testimonials = await Testimonial.find({ 
      page_id,
      deleteflag: false 
    });
    
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Testimonial
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Testimonial
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial updated", 
      data: testimonial 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { deleteflag: true },
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial deleted (soft)", 
      data: testimonial 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Testimonials by Rating (additional filter)
const getTestimonialsByRating = async (req, res) => {
  try {
    const { minRating } = req.query;
    const filter = { 
      deleteflag: false,
      rating: { $gte: parseInt(minRating) || 1 } 
    };

    const testimonials = await Testimonial.find(filter);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsByPageId,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialsByRating
};
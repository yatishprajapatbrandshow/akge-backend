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
      page_id: page_id || null, // Legacy single assignment
      page_ids: page_id ? [page_id] : [] // New array assignment
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
      filter.$or = [
        { page_id: page_id },
        { page_ids: page_id }
      ];
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
    
    // Find testimonials where either:
    // 1. page_id matches exactly (legacy)
    // 2. page_ids array contains the page_id (new)
    const testimonials = await Testimonial.find({
      $or: [
        { page_id: page_id },
        { page_ids: page_id }
      ],
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
    const { id } = req.params;
    const { page_id, ...otherUpdates } = req.body;
    
    // First get the current testimonial
    const currentTestimonial = await Testimonial.findById(id);
    if (!currentTestimonial) {
      return res.status(404).json({ 
        success: false, 
        message: "Testimonial not found" 
      });
    }

    // If a new page_id is being added
    if (page_id) {
      // Convert to string for comparison
      const pageIdStr = page_id.toString();
      
      // Check if this page_id already exists
      const exists = currentTestimonial.page_ids.some(id => id.toString() === pageIdStr);
      
      if (!exists) {
        // Add to array if not already present
        await Testimonial.findByIdAndUpdate(
          id,
          { 
            $addToSet: { page_ids: page_id }, // Safely add to array
            $set: { 
              ...otherUpdates,
              // Update single page_id only if array was empty
              page_id: currentTestimonial.page_ids.length === 0 ? page_id : currentTestimonial.page_id
            }
          },
          { new: true }
        );
      } else {
        // Just update other fields if page_id already exists
        await Testimonial.findByIdAndUpdate(
          id,
          { $set: otherUpdates },
          { new: true }
        );
      }
    } else {
      // Update only other fields if no page_id provided
      await Testimonial.findByIdAndUpdate(
        id,
        { $set: otherUpdates },
        { new: true }
      );
    }

    const updatedTestimonial = await Testimonial.findById(id);
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial updated", 
      data: updatedTestimonial 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
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
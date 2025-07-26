const { HighlightBanner, Slug } = require("../models");

/**
 * Add a new highlight banner
 */
const addHighlightBanner = async (req, res) => {
  try {
    const { pageid, banner, description, link, size, title } = req.body;

    // Validate required fields
    if (!pageid || !banner || !description || !link || !title || !size) {
      return res.status(400).json({
        status: false,
        message: "All fields are required: pageid, banner, description, link, title, size.",
        data: false,
      });
    }
    if (typeof pageid !== "number") {
      return res.status(400).json({
        status: false,
        message: "Invalid pageid. Must be a number.",
        data: false,
      });
    }
    const checkpageid = await Slug.findOne({ page_id: pageid });
    if (!checkpageid) {
      return res.status(400).json({
        status: false,
        message: "Invalid pageid. Page not found.",
        data: false,
      });
    }
    const checkBanner = await HighlightBanner.findOne({}).sort({ order: -1 });
    // Create new highlight banner
    const newBanner = new HighlightBanner({
      pageid,
      banner,
      description,
      link,
      order: checkBanner ? checkBanner.order + 1 : 1,
      size,
      title
    });
    await newBanner.save();

    return res.status(201).json({
      status: true,
      message: "Highlight banner added successfully.",
      data: newBanner,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
/**
 * Update an existing highlight banner
 */
const updateHighlightBanner = async (req, res) => {
  try {
    const { _id, pageid, banner, description, link, status, size,title } = req.body;

    // Validate required fields
    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "_id is required.",
        data: false,
      });
    }

    if (typeof pageid !== "number") {
      return res.status(400).json({
        status: false,
        message: "Invalid pageid. Must be a number.",
        data: false,
      });
    }
    const checkpageid = await Slug.findOne({ page_id: pageid });
    if (!checkpageid) {
      return res.status(400).json({
        status: false,
        message: "Invalid pageid. Page not found.",
        data: false,
      });
    }
    // Find and update banner
    const updatedBanner = await HighlightBanner.findByIdAndUpdate(
      _id,
      { pageid, banner, description, link, status, size,title },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Highlight banner updated successfully.",
      data: updatedBanner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
/**
 * Delete a highlight banner (soft delete)
 */
const deleteHighlightBanner = async (req, res) => {
  try {
    const { _id } = req.body;

    // Soft delete: set deleteflag to true
    const deletedBanner = await HighlightBanner.findByIdAndUpdate(
      _id,
      { deleteflag: true, status: false },
      { new: true }
    );

    if (!deletedBanner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Highlight banner deleted successfully.",
      data: deletedBanner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
/**
 * Get a highlight banner by ID
 */
const getHighlightBannerById = async (req, res) => {
  try {
    const { _id } = req.query;

    const banner = await HighlightBanner.findById(_id).where({
      deleteflag: false,
      status: true,
    });

    if (!banner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        status: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Highlight banner fetched successfully.",
      data: banner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

/**
 * Get highlight banners List
 */
const getHighlightBannerList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      status,
      pageid,
    } = req.query;

    const query = {
      deleteflag: false,
    };

    if (status !== undefined && status !== "") {
      query.status = status === "true";
    }

    if (pageid !== undefined && pageid !== "") {
      query.pageid = parseInt(pageid);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const totalItems = await HighlightBanner.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const banners = await HighlightBanner.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return res.status(200).json({
      status: true,
      message: "Highlight banners fetched successfully.",
      data: {
        banners,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          hasPrevPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Error in getHighlightBannerList:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: false,
    });
  }
};
/**
 * Get highlight banners by page ID
 */
const getHighlightBannerByPageId = async (req, res) => {
  try {
    const { pageid } = req.params;

    const banners = await HighlightBanner.find({ pageid, deleteflag: false });

    if (!banners.length) {
      return res.status(404).json({
        status: false,
        message: "No highlight banners found for the given page ID.",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Highlight banners fetched successfully.",
      data: banners,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
module.exports = {
  addHighlightBanner,
  getHighlightBannerList,
  updateHighlightBanner,
  deleteHighlightBanner,
  getHighlightBannerById,
  getHighlightBannerByPageId,
};

const  { Slug } = require('../models');

 const getNewsDetailPages = async (req, res) => {
  try {
    const pages = await Slug.find({ type: "NewsDetailPage" });
    res.status(200).json({ status: true, data: pages });
  } catch (error) {
    console.error("Error fetching NewsDetailPage pages:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports
    = {
    getNewsDetailPages
    };
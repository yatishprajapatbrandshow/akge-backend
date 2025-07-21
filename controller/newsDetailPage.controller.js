const { Slug } = require('../models');

const getNewsDetailPages = async (req, res) => {
  try {
    const pages = await Slug.find({ type: "News", ComponentType: "news-details", status: true, deleteflag: false });
    if (pages) {
      return res.status(404).json({
        status: false,
        message: 'Data Not Found',
        data: false
      })
    }
    res.status(200).json({ status: true, message: "News List Found !", data: pages });
  } catch (error) {
    console.error("Error fetching NewsDetailPage pages:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports
  = {
  getNewsDetailPages
};
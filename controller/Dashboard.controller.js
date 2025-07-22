const  { Slug  ,School , Departments , Faculty} = require("../models");

// Generic count function
const getStats = async (Model, filter = {}) => {
  const total = await Model.countDocuments(filter);
  const active = await Model.countDocuments({ ...filter, status: true, deleteflag: false });
  const inactive = await Model.countDocuments({ ...filter, status: false, deleteflag: false });

  return { total, active, inactive };
};

const getSlugStats = async (req, res) => {
  try {
    const [
      pages,
      news,
      circular,
      announcement,
      downloadCenter,
      schools,
      departments,
      faculty
    ] = await Promise.all([
      getStats(Slug),                          // All Pages
      getStats(Slug, { type: "News" }),
      getStats(Slug, { type: "Circular" }),
      getStats(Slug, { type: "Announcement" }),
      getStats(Slug, { type: "Download Center" }),
      getStats(School),
      getStats(Departments),
      getStats(Faculty)
    ]);

    res.status(200).json({
      pages,
      news,
      circular,
      announcement,
      downloadCenter,
      schools,
      departments,
      faculty
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getSlugStats,
};

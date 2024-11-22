const { Announcements } = require("../models");

const generateUniqueId = async (existingIds) => {
  let id;
  const existingIdsSet = new Set(existingIds); // Use Set for faster lookups
  do {
    id = Math.floor(Math.random() * 1000000); // Adjust range if needed
  } while (existingIdsSet.has(id));
  return id;
};
const addAnnouncement = async (req, res) => {
  try {
    const {
      title,
      shortDesc,
      description,
      startdate,
      enddate,
      type,
      relatedLinks,
      pdf,
    } = req.body;

    const announcements = await Announcements.find().select("sid");
    const ids = announcements.map((announcement) => announcement.sid);
    const sid = await generateUniqueId(ids);
    // Create a new announcement document
    const newAnnouncement = new Announcements({
      sid,
      title,
      shortDesc,
      description,
      startdate,
      enddate,
      type: type || "announcement", // Default type
      relatedLinks,
      pdf,
    });

    await newAnnouncement.save();

    return res.status(201).json({
      status: true,
      message: "Announcement added successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while adding announcement",
      data: false,
    });
  }
};
const updateAnnouncement = async (req, res) => {
  try {
    const {
      sid,
      title,
      shortDesc,
      description,
      startdate,
      enddate,
      type,
      relatedLinks,
      pdf,
      status
    } = req.body;

    if (!sid) {
      return res.status(400).json({
        status: false,
        message: "Announcement sid is required",
        data: false,
      });
    }
    const existing = await Announcements.findOne({ sid });
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: false,
      });
    }

    if (title) existing.title = title || existing.title;
    if (shortDesc) existing.shortDesc = shortDesc || existing.shortDesc;
    if (description) existing.description = description || existing.description;
    if (startdate) existing.startdate = startdate || existing.startdate;
    if (enddate) existing.enddate = enddate || existing.enddate;
    if (type) existing.type = type || existing.type;
    if (relatedLinks)
      existing.relatedLinks = relatedLinks || existing.relatedLinks;
    if (pdf) existing.pdf = pdf || existing.pdf;
    if (status !== undefined) existing.status = status || existing.status;

    const updatedAnnouncement = await existing.save();

    if (!updatedAnnouncement) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while updating announcement",
      data: false,
    });
  }
};

module.exports = {
  addAnnouncement,
  updateAnnouncement,
}
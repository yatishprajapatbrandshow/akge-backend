const { NewsAndEvents } = require("../models");
const generateUniqueId = require("../utils/generateSid");

const addNewsAndEvents = async (req, res) => {
  try {
    const {
      sid = 0,
      title,
      shortDesc,
      description,
      featuredImage,
      galleryimg,
      date,
      pageUrl,
      featured,
      type,
      tags,
      relatedLinks,
      status,
    } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!shortDesc) missingFields.push("Short Description");
    if (!description) missingFields.push("Description");
    if (!featuredImage) missingFields.push("Featured Image");
    if (!galleryimg) missingFields.push("Gallery Image");
    if (!date) missingFields.push("Date");
    if (!pageUrl) missingFields.push("Page URL");
    if (!featured || featured.trim() == "") missingFields.push("Featured");
    if (!type) missingFields.push("Type");
    if (!tags) missingFields.push("Tags");
    if (!relatedLinks) missingFields.push("Related Links");
    const typeArray = ["circuler", "article", "news", "event"];
    const featuredArray = ["Yes", "No"];
    if (type) {
      if (!typeArray.includes(type)) {
        return res.status(400).json({
          status: false,
          message: "Type value is must be : " + typeArray.join("/"),
          data: false,
        });
      }
    }
    if (featured) {
      if (!featuredArray.includes(featured)) {
        return res.status(400).json({
          status: false,
          message: "Featured value is must be : " + featuredArray.join("/"),
          data: false,
        });
      }
    }

    if (missingFields.length) {
      return res.status(400).json({
        status: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required`,
        data: false,
      });
    }

    // Check if the news/event entry already exists by pageUrl (or another unique identifier)
    const existingNews = await NewsAndEvents.findOne({ sid });

    if (existingNews) {
      // If it exists, update the news/event data
      existingNews.title = title;
      existingNews.shortDesc = shortDesc;
      existingNews.description = description;
      existingNews.featuredImage = featuredImage;
      existingNews.galleryimg = galleryimg;
      existingNews.date = date;
      existingNews.featured = featured;
      existingNews.type = type;
      existingNews.tags = tags;
      existingNews.relatedLinks = relatedLinks;
      existingNews.status = status;

      await existingNews.save();
      return res.status(200).json({
        status: true,
        message: "News and Event updated successfully",
        data: existingNews,
      });
    }
    // Generate a unique sid
    const existingsids = await NewsAndEvents.find({}, "sid");
    const existingIds = existingsids.map((activityMap) => activityMap.sid);
    const newSid = await generateUniqueId(existingIds);
    // If it doesn't exist, create a new entry
    const newsAndEvent = new NewsAndEvents({
      sid: newSid,
      title,
      shortDesc,
      description,
      featuredImage,
      galleryimg,
      date,
      pageUrl,
      featured,
      type,
      tags,
      relatedLinks,
      status,
    });

    await newsAndEvent.save();
    return res.status(200).json({
      status: true,
      message: "News and Event added successfully",
      data: newsAndEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error : " + error.message,
      data: false,
    });
  }
};
const getAllNewsAndEvents = async (req, res) => {
  try {
    // Fetch all news/events (You can add filters, sorting, etc., if needed)
    const newsEvents = await NewsAndEvents.find();

    if (!newsEvents.length) {
      return res.status(404).json({
        status: false,
        message: "No News and Events found",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "All News and Events found",
      data: newsEvents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error: " + error.message,
      data: false,
    });
  }
};
const getNewsAndEvent = async (req, res) => {
  try {
    const { sid } = req.query; // Assuming you're passing the pageUrl in the URL params
    if (!sid || sid.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "sid is required",
        data: false,
      });
    }
    
    // Find the news/event entry by pageUrl
    const newsEvent = await NewsAndEvents.findOne({ sid });

    if (!newsEvent) {
      return res.status(404).json({
        status: false,
        message: "News and Event not found",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "News and Event found",
      data: newsEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error: " + error.message,
      data: false,
    });
  }
};

module.exports = {
  addNewsAndEvents,
  getAllNewsAndEvents,
  getNewsAndEvent,
};

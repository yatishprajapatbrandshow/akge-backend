const { NewsAndEvents } = require("../models");
const generateUniqueId = require("../utils/generateSid");

const addNewsAndEvents = async (req, res) => {
  try {
    const {
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

    if (type && !typeArray.includes(type)) {
      return res.status(400).json({
        status: false,
        message: "Type value must be one of: " + typeArray.join("/"),
        data: false,
      });
    }

    if (featured && !featuredArray.includes(featured)) {
      return res.status(400).json({
        status: false,
        message: "Featured value must be one of: " + featuredArray.join("/"),
        data: false,
      });
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

    // Check if a news/event with the same pageUrl already exists
    const existingNews = await NewsAndEvents.findOne({
      type,
      title,
      status: true,
    });
    if (existingNews) {
      return res.status(400).json({
        status: false,
        message: "News and Event with this type and title already exists",
        data: false,
      });
    }

    // Generate a unique sid
    const existingsids = await NewsAndEvents.find({}, "sid");
    const existingIds = existingsids.map((activityMap) => activityMap.sid);
    const newSid = await generateUniqueId(existingIds);

    // Create a new news and event entry
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
    });

    const savedNews = await newsAndEvent.save();
    if (!savedNews) {
      return res.status(500).json({
        status: false,
        message: "Failed to add News and Event",
        data: false,
      });
    }
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
const updateNewsAndEvents = async (req, res) => {
  try {
    const {
      sid,
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

    if (!sid) {
      return res.status(400).json({
        status: false,
        message: "SID is required for updating",
        data: false,
      });
    }
    const typeArray = ["circuler", "article", "news", "event"];
    const featuredArray = ["Yes", "No"];
    if (type && !typeArray.includes(type)) {
      return res.status(400).json({
        status: false,
        message: "Type value must be one of: " + typeArray.join("/"),
        data: false,
      });
    }

    if (featured && !featuredArray.includes(featured)) {
      return res.status(400).json({
        status: false,
        message: "Featured value must be one of: " + featuredArray.join("/"),
        data: false,
      });
    }

    // Find existing news/event by sid
    const existingNews = await NewsAndEvents.findOne({ sid });

    if (!existingNews) {
      return res.status(404).json({
        status: false,
        message: "News and Event not found with the given SID",
        data: false,
      });
    }

    // Update only the fields that are present in the request
    if (title !== undefined) existingNews.title = title;
    if (shortDesc !== undefined) existingNews.shortDesc = shortDesc;
    if (description !== undefined) existingNews.description = description;
    if (featuredImage !== undefined) existingNews.featuredImage = featuredImage;
    if (galleryimg !== undefined) existingNews.galleryimg = galleryimg;
    if (date !== undefined) existingNews.date = date;
    if (pageUrl !== undefined) existingNews.pageUrl = pageUrl;
    if (featured !== undefined) existingNews.featured = featured;
    if (type !== undefined) existingNews.type = type;
    if (tags !== undefined) existingNews.tags = tags;
    if (relatedLinks !== undefined) existingNews.relatedLinks = relatedLinks;
    if (status !== undefined) existingNews.status = status;

    // Save the updated news/event
    const savedNews = await existingNews.save();

    return res.status(200).json({
      status: true,
      message: "News and Event updated successfully",
      data: savedNews,
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
const getAllNewsAndEvents = async (req, res) => {
  try {
    const { type } = req.query;
    
    // Prepare the query object. If type is not provided, it won't filter by type.
    const query = { status: true };
    if (type) {
      query.type = type;
    }
    
    // Fetch all news/events with the optional type filter
    const newsEvents = await NewsAndEvents.find(query);
    
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
    const { sid, type } = req.query; // Assuming you're passing the sid and type in the URL params
    
    if (!sid || sid.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "sid is required",
        data: false,
      });
    }

    // Build the query object dynamically based on the presence of 'type'
    const query = { sid, status: true };
    
    // Include 'type' in the query only if it is provided
    if (type) {
      query.type = type;
    }

    // Find the news/event entry based on the query
    const newsEvent = await NewsAndEvents.findOne(query);

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

const searchNewsAndEvents = async (req, res) => {
  try {
    const { title, type } = req.query;

    let query = {};

    // Title search (if provided)
    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }
    // Type validation and filter
    const validTypes = ["circuler", "article", "news", "event"]; // Define valid types
    if (type) {
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          status: false,
          message: "Invalid type. Must be one of: " + validTypes.join(", "),
          data: false,
        });
      }
      query.type = type; // Add the type filter to the query
    }

    // Fetch news and events based on the query (title search or latest 10 events)
    const newsAndEvents = await NewsAndEvents.find(query)
      .sort({ date: -1 }) // Sort by date in descending order to get the latest ones
      .limit(10); // Limit to 10 results

    return res.status(200).json({
      status: true,
      message: newsAndEvents.length
        ? "News and Events found"
        : "No News and Events found",
      data: newsAndEvents,
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
  updateNewsAndEvents,
  getAllNewsAndEvents,
  getNewsAndEvent,
  searchNewsAndEvents,
};

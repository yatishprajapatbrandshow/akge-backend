const { Meta } = require("../models");

const getMeta = async (req, res) => {
  try {
    const { pageid } = req.query;

    if (!pageid) {
      return res
        .status(400)
        .json({ status: false, message: "Page ID is required", data: false });
    }
    const meta = await Meta.findOne({
      pageid,
    });
    if (meta) {
      return res
        .status(200)
        .json({ status: true, message: "Meta found", data: meta });
    }
    return res
      .status(404)
      .json({ status: false, message: "Meta not found", data: false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const addMeta = async (req, res) => {
  try {
    const { pageid, metatitle, metaDescription, metaKeywords, path } = req.body;
    const missings = [];
    if (!pageid) missings.push("Page ID");
    if (!metatitle) missings.push("Meta Title");
    if (!metaDescription) missings.push("Meta Description");
    if (!metaKeywords) missings.push("Meta Keywords");
    if (!path) missings.push("Path");

    if (missings.length) {
      return res.status(400).json({
        status: false,
        message: `${missings.join(", ")} ${
          missings.length > 1 ? "are" : "is"
        } required`,
        data: false,
      });
    }

    // Check if the meta entry already exists for the given pageid
    const existingMeta = await Meta.findOne({ pageid });

    if (existingMeta) {
      // If it exists, update the meta data
      existingMeta.metatitle = metatitle;
      existingMeta.metaDescription = metaDescription;
      existingMeta.metaKeywords = metaKeywords;
      existingMeta.path = path;

      await existingMeta.save();
      return res.status(200).json({
        status: true,
        message: "Meta updated",
        data: existingMeta,
      });
    }

    // If it doesn't exist, create a new meta entry
    const meta = new Meta({
      pageid,
      metatitle,
      metaDescription,
      metaKeywords,
      path,
    });

    await meta.save();
    res.status(200).json({ status: true, message: "Meta added", data: meta });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};

module.exports = {
  getMeta,
  addMeta,
};

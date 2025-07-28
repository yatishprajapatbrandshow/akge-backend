const { Slug, ExtraParamsData, HighlightBanner } = require("../models");
const bcrypt = require("bcryptjs");
const imagePath = "https://csip-image.blr1.digitaloceanspaces.com/csip-image"
// const jwt = require('jsonwebtoken');
const generateUniqueId = async (existingIds) => {
  let id;
  do {
    // Generate a random number (you can adjust the range as needed)
    id = Math.floor(Math.random() * 1000000);
  } while (existingIds.includes(id)); // Ensure the ID is unique
  return id;
};
function createPathFromTitle(title) {
  // Remove special characters, keep only letters, numbers, and spaces
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .trim(); // Remove leading/trailing whitespace

  // Convert to lowercase and replace spaces with hyphens
  const path = sanitizedTitle.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens

  return "/" + path;
}
function createPathFromTitle(title) {
  // Remove special characters, keep only letters, numbers, and spaces
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .trim(); // Remove leading/trailing whitespace

  // Convert to lowercase and replace spaces with hyphens
  const path = sanitizedTitle.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens

  return "/" + path;
}
const update = async (req, res) => {
  try {
    // Destructure the request body with default values
    const {
      page_id,
      parent_id = 0,
      clg_id = 1,
      languageId = 1,
      price = 0,
      name,
      date,
      shortdesc,
      description,
      // params
      param1,
      paramvalue1,
      param_img1,
      param_url1,
      param2,
      paramvalue2,
      param_img2,
      param_url2,
      param3,
      paramvalue3,
      param_img3,
      param_url3,
      param4,
      paramvalue4,
      param_img4,
      param_url4,
      param5,
      paramvalue5,
      param_img5,
      param_url5,
      param6,
      paramvalue6,
      param_img6,
      param_url6,
      param7,
      paramvalue7,
      param_img7,
      param_url7,
      param8,
      paramvalue8,
      param_img8,
      param_url8,
      param9,
      paramvalue9,
      param_img9,
      param_url9,
      param10,
      paramvalue10,
      param_img10,
      param_url10,
      banner_img,
      metatitle,
      metadesc,
      keywords_tag,
      tag1,
      tag2,
      tag3,
      schemaid,
      nic_name,
      col_width,
      featured_img,
      video_url,
      type,
      old_url,
      highlightBanner,
      status = true,
      deleteflag = false,
      editedby = "Admin",
      ComponentType,
      stream,
      mainReportImage
    } = req.body;

    // Validate required fields
    if (!page_id || !name) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields : page_id or name",
        data: false,
      });
    }

    // Find the existing slug by page_id
    const existingSlug = await Slug.findOne({ page_id });
    if (!existingSlug) {
      return res
        .status(404)
        .json({ status: false, message: "Slug not found", data: false });
    }

    // Generate updated slug and path if the name has changed
    let slug = existingSlug.slug;
    let path = existingSlug.path;

    if (name !== existingSlug.name) {
      slug = createPathFromTitle(name);

      // Check if the new slug already exists
      const duplicateSlug = await Slug.findOne({
        slug,
        page_id: { $ne: page_id }
      });
      if (duplicateSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
          data: false,
        });
      }

      if (parent_id === 0) {
        path = slug; // Root level
      } else {
        const parentSlugDoc = await Slug.findOne({ page_id: parent_id });
        if (!parentSlugDoc) {
          return res.status(400).json({
            status: false,
            message: "Parent slug not found",
            data: false,
          });
        }
        path = `${parentSlugDoc.path}${slug}`;
      }
    }

    // Prepare id_path
    let id_path = existingSlug.id_path;
    if (parent_id !== existingSlug.parent_id) {
      const parentSlugDoc = await Slug.findOne({ page_id: parent_id });
      id_path = parentSlugDoc?.id_path
        ? `${parentSlugDoc?.id_path}/${page_id}`
        : `/${page_id}`;
    }

    // Update the slug fields
    const updatedSlug = await Slug.findOneAndUpdate(
      { page_id },
      {
        parent_id,
        clg_id,
        languageId,
        price,
        name,
        date,
        shortdesc,
        description,
        param1,
        paramvalue1,
        param_img1,
        param_url1,
        param2,
        paramvalue2,
        param_img2,
        param_url2,
        param3,
        paramvalue3,
        param_img3,
        param_url3,
        param4,
        paramvalue4,
        param_img4,
        param_url4,
        param5,
        paramvalue5,
        param_img5,
        param_url5,
        param6,
        paramvalue6,
        param_img6,
        param_url6,
        param7,
        paramvalue7,
        param_img7,
        param_url7,
        param8,
        paramvalue8,
        param_img8,
        param_url8,
        param9,
        paramvalue9,
        param_img9,
        param_url9,
        param10,
        paramvalue10,
        param_img10,
        param_url10,
        banner_img,
        slug,
        metatitle,
        metadesc,
        keywords_tag,
        tag1,
        tag2,
        tag3,
        schemaid,
        nic_name,
        col_width,
        featured_img,
        video_url,
        type,
        path,
        id_path,
        old_url,
        highlightBanner,
        status,
        editedon: Date.now(),
        editedby,
        deleteflag,
        ComponentType,
        stream,
        mainReportImage
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      status: true,
      message: "Slug updated successfully",
      data: updatedSlug,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const addPageInactive = async (req, res) => {
  try {
    const {
      parent_id = 0,
      clg_id = 1,
      languageId = 1,
      price = 0,
      type,
      name,
      ComponentType
    } = req.body;
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
        data: false,
      });
    }

    // Generate slug and path
    const slug = createPathFromTitle(name);
    let path;
    let parentSlugDoc;
    if (parent_id === 0) {
      path = slug; // Root level
    } else {
      parentSlugDoc = await Slug.findOne({ page_id: parent_id });
      if (!parentSlugDoc) {
        return res.status(400).json({
          status: false,
          message: "Parent slug not found",
          data: false,
        });
      }
      path = `${parentSlugDoc.path}${slug}`; // Append slug to parent path
    }

    // Check if the slug already exists
    const existingSlug = await Slug.findOne({ slug });
    if (existingSlug) {
      return res
        .status(400)
        .json({ status: false, message: "Slug already exists", data: false });
    }

    // Fetch existing IDs from the database
    const existingSlugs = await Slug.find().select("page_id");
    const existingIds = existingSlugs.map((slug) => slug.page_id);
    const page_id = await generateUniqueId(existingIds);

    // Prepare id_path
    let id_path = parentSlugDoc?.id_path
      ? `${parentSlugDoc?.id_path}/${page_id}`
      : `/${page_id}`;

    // Create a new slug object
    const newSlug = new Slug({
      page_id,
      parent_id,
      clg_id,
      languageId,
      price,
      name,
      type,
      slug,
      path,
      id_path,
      status: false,
      addedon: Date.now(),
      addedby: "Admin",
      editedon: null,
      editedby: null,
      deleteflag: false,
      ComponentType
    });

    // Save the new slug to the database
    await newSlug.save();
    return res.status(201).json({
      status: true,
      message: "Slug created successfully",
      data: newSlug,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const getParent = async (req, res) => {
  const { query = "", page = 1, limit = 10, type, } = req.body; // Allow parentId to be dynamic, default to 0

  try {
    // Calculate how many records to skip based on the current page and limit
    const skip = (page - 1) * limit;

    let pages = [];
    let total = 0;

    // Build query conditions for filtering
    const queryConditions = {};

    // If parentId is provided, add it to the filter
    // queryConditions.parentId = parentId;

    // If query (search term) is provided, add it to the filter
    if (query !== "") {
      queryConditions.name = { $regex: query, $options: "i" }; // Case-insensitive search
    }

    // Check for status and deleteflag if provided (defaulting to true/false if not)
    queryConditions.status = true;
    queryConditions.deleteflag = false;

    // If `type` is provided, add it to the conditions
    if (type) {
      queryConditions.type = type;
    }

    // Find pages based on conditions
    pages = await Slug.find(queryConditions, { name: 1, page_id: 1 }) // Project only `name` and `page_id`
      .skip(skip) // Skip pages based on pagination
      .limit(limit); // Limit the number of pages returned

    // Get total number of pages matching the conditions
    total = await Slug.countDocuments(queryConditions);

    // If no pages are found, respond with the default "This is parent page"
    if (pages.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No pages found, default value returned.",
        data: {
          pages: [{ name: "This is main page", page_id: 0 }], // Default value with null `reportId`
          total: 1, // 1 because we're providing the default option
          page,
          limit,
        },
      });
    }

    // Otherwise, return the pages found with `name` and `reportId`
    res.status(200).json({
      status: true,
      message: "Pages fetched successfully",
      data: {
        pages: [{ name: "This is main page", page_id: 0 }, ...pages], // The actual list of pages (name and reportId)
        total, // Total pages matching the conditions
        page, // Current page
        limit, // Results per page
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
      data: false,
    });
  }
};

const getList = async (req, res) => {
  try {
    const slugs = await Slug.find();
    if (slugs.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No data found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Slugs fetched successfully",
      data: slugs,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const getSlugByType = async (req, res) => {
  try {
    let { type } = req.query;

    // Ensure `type` is treated as an array
    if (!Array.isArray(type)) {
      type = type ? type.split(",") : [];
    }
    const slugs = await Slug.find({ type: { $in: type } });

    if (slugs.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No data found",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Slugs fetched successfully",
      data: slugs,
    });
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: false,
    });
  }
};
const getById = async (req, res) => {
  try {
    const { page_id } = req.query;
    if (!page_id) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
        data: false,
      });
    }
    if (isNaN(page_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid page_id",
        data: false,
      });
    }
    const slug = await Slug.findOne({ page_id });

    if (!slug) {
      return res.status(404).json({
        status: false,
        message: "Slug not found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Slug fetched successfully",
      data: slug,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: false,
    });
  }
};
const buildBreadcrumb = async (slugDoc) => {
  const breadcrumb = [];
  let current = slugDoc;

  while (current?.parent_id) {
    const parent = await Slug.findOne({ page_id: current.parent_id, status: true, deleteflag: false }).lean();
    if (!parent) break;
    breadcrumb.unshift({
      name: parent?.title || parent?.name || "Untitled",
      Link: parent?.path,
    });
    current = parent;
  }

  // Add current page as last item
  breadcrumb.push({
    name: slugDoc?.title || slugDoc?.name || "Current Page",
    Link: slugDoc?.path,
  });

  return breadcrumb;
};

const getBySlug = async (req, res) => {
  try {
    let { path } = req.query;

    if (!path) {
      return res.status(400).json({
        status: false,
        message: "path is required",
        data: false,
      });
    }

    // Remove query params if any
    if (path.includes('?')) {
      path = path.split('?')[0];
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const data = await Slug.findOne({ path, deleteflag: false, status: true }).lean().populate('stream');
    if (!data) {
      return res.status(404).json({
        status: false,
        data: false,
        message: 'path not found',
      });
    }

    // Get breadcrumb
    const breadcrumb = await buildBreadcrumb(data);
    // Get extra component data
    const extraParamsData = await ExtraParamsData.find({
      pageid: data?.page_id,
      status: true,
      deleteflag: false
    })
      .select('param paramDesc paramImg paramUrl orderSequence holder calid type widgetType')
      .lean();

    // Normalize and transform array to object
    const formattedExtraParams = extraParamsData.reduce((acc, item) => {
      const normalizedKey = item.holder.toLowerCase().replace(/\s+/g, '');
      if (!acc[normalizedKey]) {
        acc[normalizedKey] = {};
      }
      acc[normalizedKey] = item;
      return acc;
    }, {});

    const highlightBanner = await HighlightBanner.find({ pageid: data?.page_id, status: true, deleteflag: false })

    const finalData = {
      ...data,
      extraComponentData: formattedExtraParams || false,
      breadCrumb: breadcrumb || false,
      highlightBanner: highlightBanner || false,
      banner_img: imagePath + data?.banner_img
    };

    return res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      data: finalData,
    });

  } catch (error) {
    console.error("Error in getBySlug:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      data: false,
    });
  }
};


module.exports = {
  // insert,
  getParent,
  getList,
  addPageInactive,
  update,
  getSlugByType,
  getById,
  getBySlug
};
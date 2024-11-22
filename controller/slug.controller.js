const { Slug } = require("../models");
const bcrypt = require("bcryptjs");
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
// const insert = async (req, res) => {
//   try {
//     // Destructure the request body with default values
//     const {
//       parent_id = 0,
//       clg_id = 1,
//       languageId = 1,
//       price = 0,
//       name,
//       date,
//       shortdesc,
//       description,
//       // params
//       param1,
//       paramvalue1,
//       param_img1,
//       param_url1,
//       param2,
//       paramvalue2,
//       param_img2,
//       param_url2,
//       param3,
//       paramvalue3,
//       param_img3,
//       param_url3,
//       param4,
//       paramvalue4,
//       param_img4,
//       param_url4,
//       param5,
//       paramvalue5,
//       param_img5,
//       param_url5,
//       param6,
//       paramvalue6,
//       param_img6,
//       param_url6,
//       param7,
//       paramvalue7,
//       param_img7,
//       param_url7,
//       param8,
//       paramvalue8,
//       param_img8,
//       param_url8,
//       param9,
//       paramvalue9,
//       param_img9,
//       param_url9,
//       param10,
//       paramvalue10,
//       param_img10,
//       param_url10,
//       banner_img,
//       metatitle,
//       metadesc,
//       keywords_tag,
//       tag1,
//       tag2,
//       tag3,
//       schemaid,
//       nic_name,
//       col_width,
//       featured_img,
//       video_url,
//       type,
//       old_url,
//       status = true,
//       addedby = "Admin",
//     } = req.body;

//     // Validate required fields
//     if (!name) {
//       return res.status(400).json({
//         status: false,
//         message: "Missing required fields",
//         data: false,
//       });
//     }

//     // Generate slug and path
//     const slug = createPathFromTitle(name);
//     let path;
//     let parentSlugDoc;
//     if (parent_id === 0) {
//       path = slug; // Root level
//     } else {
//       parentSlugDoc = await Slug.findOne({ page_id: parent_id });
//       if (!parentSlugDoc) {
//         return res.status(400).json({
//           status: false,
//           message: "Parent slug not found",
//           data: false,
//         });
//       }
//       path = `${parentSlugDoc.path}${slug}`; // Append slug to parent path
//     }

//     // Check if the slug already exists
//     const existingSlug = await Slug.findOne({ slug });
//     if (existingSlug) {
//       return res
//         .status(400)
//         .json({ status: false, message: "Slug already exists", data: false });
//     }

//     // Fetch existing IDs from the database
//     const existingSlugs = await Slug.find().select("page_id");
//     const existingIds = existingSlugs.map((slug) => slug.page_id);
//     const page_id = await generateUniqueId(existingIds);

//     // Prepare id_path
//     let id_path = parentSlugDoc?.id_path
//       ? `${parentSlugDoc?.id_path}/${page_id}`
//       : `/${page_id}`;

//     // Create a new slug object
//     const newSlug = new Slug({
//       page_id,
//       parent_id,
//       clg_id,
//       languageId,
//       price,
//       name,
//       shortdesc,
//       description,
//       param1,
//       paramvalue1,
//       param_img1,
//       param_url1,
//       param2,
//       paramvalue2,
//       param_img2,
//       param_url2,
//       param3,
//       paramvalue3,
//       param_img3,
//       param_url3,
//       param4,
//       paramvalue4,
//       param_img4,
//       param_url4,
//       param5,
//       paramvalue5,
//       param_img5,
//       param_url5,
//       param6,
//       paramvalue6,
//       param_img6,
//       param_url6,
//       param7,
//       paramvalue7,
//       param_img7,
//       param_url7,
//       param8,
//       paramvalue8,
//       param_img8,
//       param_url8,
//       param9,
//       paramvalue9,
//       param_img9,
//       param_url9,
//       param10,
//       paramvalue10,
//       param_img10,
//       param_url10,
//       banner_img,
//       slug,
//       metatitle,
//       metadesc,
//       keywords_tag,
//       tag1,
//       tag2,
//       tag3,
//       schemaid,
//       nic_name,
//       col_width,
//       featured_img,
//       video_url,
//       date: date || Date.now(),
//       featured_status: false,
//       type,
//       path,
//       id_path,
//       old_url,
//       status,
//       addedon: Date.now(),
//       addedby,
//       editedon: null,
//       editedby: null,
//       deleteflag: false,
//     });

//     // Save the new slug to the database
//     await newSlug.save();
//     res.status(201).json({
//       status: true,
//       message: "Slug created successfully",
//       data: newSlug,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ status: false, message: "Server error", data: false });
//   }
// };

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
      editedby = "Admin",
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
        page_id: { $ne: page_id },
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
    });

    // Save the new slug to the database
    await newSlug.save();
    res.status(201).json({
      status: true,
      message: "Slug created successfully",
      data: newSlug,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
// const insert = async (req, res) => {
//     console.log("Entered");

//     try {
//         const {
//             parent_id = 0,      // Default value
//             clg_id = 1,         // Default value
//             languageId = 1,     // Default value
//             price = 0,          // Default value
//             name,
//             date,
//             shortdesc,
//             description,//3
//             param1,
//             paramvalue1,
//             param_img1,
//             param_url1,
//             param2,
//             paramvalue2,
//             param_img2,
//             param_url2,
//             param3,
//             paramvalue3,
//             param_img3,
//             param_url3,
//             param4,
//             paramvalue4,
//             param_img4,
//             param_url4,
//             param5,
//             paramvalue5,
//             param_img5,
//             param_url5,
//             param6,
//             paramvalue6,
//             param_img6,
//             param_url6,
//             param7,
//             paramvalue7,
//             param_img7,
//             param_url7,
//             param8,
//             paramvalue8,
//             param_img8,
//             param_url8,
//             param9,
//             paramvalue9,
//             param_img9,
//             param_url9,
//             param10,
//             paramvalue10,
//             param_img10,
//             param_url10,
//             banner_img,
//             metatitle,
//             metadesc,
//             keywords_tag,
//             tag1,
//             tag2,
//             tag3,
//             schemaid,
//             nic_name,
//             col_width,
//             featured_img,
//             video_url,
//             type,
//             old_url,
//             status = true,      // Default value
//             addedby = "Admin",  // Default value
//         } = req.body;

//         let path;
//         let slug = createPathFromTitle(name);
//         console.log(slug);

//         if (parent_id === 0) {
//             path = slug
//         } else {
//             const res = Slug.find({ page_id: parent_id }).select('path');
//             path += res + slug;
//         }
//         console.log(path);

//         if (!name) {
//             return res.status(400).json({ status: false, message: 'Missing required fields', data: false });
//         }

//         // Check if the slug already exists
//         const existingSlug = await Slug.findOne({ slug });
//         if (existingSlug) {
//             return res.status(400).json({ status: false, message: 'Slug already exists', data: false });
//         }

//         // Fetch existing IDs from the database
//         const existingSlugs = await Slug.find().select('page_id');
//         const existingIds = existingSlugs.map(slug => slug.page_id);
//         const page_id = await generateUniqueId(existingIds);

//         // Split the path to get individual segments
//         const pathSegments = path.split('/').filter(segment => segment); // Remove empty segments
//         // if (pathSegments[pathSegments.length - 1] !== slug) {
//         //     return res.status(400).json({ status: false, message: 'Slug and path segment do not match', data: false });
//         // }
//         if (!path.endsWith('/')) {
//             path += "/"
//         }
//         // Fetch the parent slug ID if there are multiple path segments
//         let parentId = parent_id;
//         console.log(pathSegments);
//         if (pathSegments.length > 1) {
//             console.log("entered In this code");

//             const parentSlug = pathSegments[pathSegments.length - 2]; // Second last segment of path

//             // Find the parent slug by its slug
//             const parentSlugDoc = await Slug.findOne({ slug: parentSlug });
//             if (parentSlugDoc) {
//                 parentId = parentSlugDoc.page_id;
//             } else {
//                 return res.status(400).json({ status: false, message: `Parent slug not found for path segment: ${parentSlug}`, data: false });
//             }
//         }

//         // Generate id_path based on the new slug's page_id
//         const idPathSegments = await Promise.all(pathSegments.map(async (segment) => {
//             const existingSlug = await Slug.findOne({ slug: segment });
//             return existingSlug ? existingSlug.page_id : null; // Return the page_id or null
//         }));
//         console.log(idPathSegments);

//         let id_path = idPathSegments.filter(id => id !== null).join('/'); // Filter out nulls and join
//         console.log(id_path);
//         id_path += "/"
//         id_path += page_id;

//         console.log(page_id);
//         console.log(id_path);

//         // Create a new slug object
//         const newSlug = new Slug({
//             page_id,
//             parent_id: parentId,  // Set parent_id based on the path logic above
//             clg_id,
//             languageId,
//             price,
//             name,
//             shortdesc,
//             description,
//             param1,
//             paramvalue1,
//             param_img1,
//             param_url1,
//             param2,
//             paramvalue2,
//             param_img2,
//             param_url2,
//             param3,
//             paramvalue3,
//             param_img3,
//             param_url3,
//             param4,
//             paramvalue4,
//             param_img4,
//             param_url4,
//             param5,
//             paramvalue5,
//             param_img5,
//             param_url5,
//             param6,
//             paramvalue6,
//             param_img6,
//             param_url6,
//             param7,
//             paramvalue7,
//             param_img7,
//             param_url7,
//             param8,
//             paramvalue8,
//             param_img8,
//             param_url8,
//             param9,
//             paramvalue9,
//             param_img9,
//             param_url9,
//             param10,
//             paramvalue10,
//             param_img10,
//             param_url10,
//             banner_img,
//             slug,
//             metatitle,
//             metadesc,
//             keywords_tag,
//             tag1,
//             tag2,
//             tag3,
//             schemaid,
//             nic_name,
//             col_width,
//             featured_img,
//             video_url,
//             date: date || Date.now(),    // Set date to now
//             featured_status: false, // Default value
//             type,
//             path,
//             id_path,
//             old_url,
//             status,
//             addedon: Date.now(),   // Set addedon to now
//             addedby,
//             editedon: null,        // Initially null
//             editedby: null,        // Initially null
//             deleteflag: false,     // Default value
//         });

//         // Save the new slug to the database
//         await newSlug.save();
//         res.status(201).json({ status: true, message: 'Slug created successfully', data: newSlug });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: false, message: 'Server error', data: false });
//     }
// };

const getParent = async (req, res) => {
  const { query = "", page = 1, limit = 10 } = req.body; // page and limit are for pagination

  try {
    // Calculate how many records to skip based on the current page and limit
    const skip = (page - 1) * limit;

    let pages = [];
    let total = 0;

    // If the search query is empty, find pages where parentId is 0
    if (query === "") {
      // Find parent pages with parentId = 0, returning `name` and `reportId`
      pages = await Slug.find(
        { parentId: 0 },
        { name: 1, page_id: 1 } // Project only `name` and `reportId`
      )
        .skip(skip) // Skip pages based on pagination
        .limit(limit); // Limit the number of pages returned

      // Get total number of pages where parentId = 0
      total = await Slug.countDocuments({ parentId: 0 });
    } else {
      // Find parent pages matching the search query, only returning `name` and `reportId`
      pages = await Slug.find(
        {
          name: { $regex: query, $options: "i" }, // Case-insensitive search using regex
        },
        { name: 1, page_id: 1 } // Project only `name` and `reportId`
      )
        .skip(skip) // Skip pages based on pagination
        .limit(limit); // Limit the number of pages returned

      // Get total number of pages matching the query
      total = await Slug.countDocuments({
        name: { $regex: query, $options: "i" },
        parentId: 0,
      });
    }

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
        total, // Total pages matching the query or parentId=0
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
    const slugs = await Slug.find({ deleteflag: false });
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
      type = type ? type.split(',') : [];
    }
    const slugs = await Slug.find({ type: { $in: type }, deleteflag: false });

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
    console.error('Error fetching slugs:', error);
    return res.status(500).json({
      status: false,
      message: "Server error",
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
  getSlugByType
};

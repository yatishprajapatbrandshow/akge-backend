const  { Slug } = require('../models');

// Recursive helper to update children
async function updateChildPaths(parentId, oldBasePath, newBasePath) {
  const children = await Slug.find({ parent_id: parentId });

  for (const child of children) {
    // Replace the old base path part with the new base path
    const updatedPath = child.path.replace(oldBasePath, newBasePath);
    child.path = updatedPath;

    await child.save();

    // Recursively update grandchildren
    await updateChildPaths(child.page_id, oldBasePath, newBasePath);
  }
}

const editPath = async (req, res) => {
  try {
    const { page_id, title, path, update_children } = req.body;

    if (!page_id) {
      return res.status(400).json({
        status: false,
        message: 'Page ID is required'
      });
    }

    const slug = await Slug.findOne({ page_id });
    if (!slug) {
      return res.status(404).json({
        status: false,
        message: 'Page not found'
      });
    }

    let oldPath = slug.path;
    let cleanedPath = slug.path;

    // Update name from title if provided
    if (title) {
      slug.name = title;
    }

    // Clean and update path if provided
    if (path) {
      cleanedPath = path.replace(/\?/g, '').replace(/\/{2,}/g, '/');
      slug.path = cleanedPath;
    }

    await slug.save();

    // If update_children is true and path was changed
    if (update_children && path && oldPath !== cleanedPath) {
      await updateChildPaths(page_id, oldPath, cleanedPath);
    }

    res.json({
      status: true,
      message: 'Slug details updated successfully',
      data: {
        page_id,
        updated_name: slug.name,
        updated_path: slug.path
      }
    });

  } catch (error) {
    console.error('Error updating slug details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = { editPath };

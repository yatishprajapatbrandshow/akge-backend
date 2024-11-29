const mongoose = require("mongoose");
const { School, Departments, Faculty } = require("../models");

// Create and Save a new School
const create = async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      yearEstablished,
      schoolType,
      accreditation,
      contactNumber,
      email,
      schoolCode,
    } = req.body;

    // Validate required fields
    if (!name || !yearEstablished || !schoolType || !schoolCode || !location) {
      return res.status(400).json({
        status: false,
        message: "Content can not be empty!",
        data: false,
      });
    }

    // Check for duplicate school
    const schoolExists = await School.findOne({ schoolCode });
    if (schoolExists) {
      return res.status(400).json({
        status: false,
        message: "School already exists!",
        data: false,
      });
    }

    // Create and save new school
    const school = new School({
      name,
      location,
      description,
      yearEstablished,
      schoolType,
      accreditation,
      contactNumber,
      email,
      schoolCode,
      status: true,
      deleteflg: false,
    });

    const saved = await school.save();
    return res
      .status(201)
      .json({ status: true, message: "School created!", data: saved });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
const findAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const schools = await School.find({ status: true, deleteflag: false })
      .populate("departments")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    if (!schools.length) {
      return res
        .status(204)
        .json({ status: false, message: "No schools found", data: false });
    }

    return res
      .status(200)
      .json({ status: true, message: "Schools found!", data: schools });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
const findById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || mongoose.Types.ObjectId.isValid(id) === false) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid school _id!", data: false });
    }

    const school = await School.findOne({
      _id: id,
      status: true,
      deleteflag: false,
    })
      .populate("departments")
      .exec();

    if (!school) {
      return res
        .status(404)
        .json({ status: false, message: "School not found!", data: false });
    }

    return res
      .status(200)
      .json({ status: true, message: "School found!", data: school });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
const update = async (req, res) => {
  try {
    const {
      _id,
      name,
      location,
      description,
      yearEstablished,
      schoolType,
      accreditation,
      contactNumber,
      email,
      schoolCode,
      departments,
    } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "_id is required!",
        data: false,
      });
    }

    // Check for duplicate schoolCode
    const duplicateSchool = await School.findOne({
      schoolCode,
      _id: { $ne: _id },
    }).exec();
    if (duplicateSchool) {
      return res.status(400).json({
        status: false,
        message: "Another school with the same schoolCode already exists!",
        data: false,
      });
    }

    // Find and update the school
    const updatedSchool = await School.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          location,
          description,
          yearEstablished,
          schoolType,
          accreditation,
          contactNumber,
          email,
          schoolCode,
          departments,
        },
      },
      { new: true }
    ).exec();

    if (!updatedSchool) {
      return res.status(404).json({
        status: false,
        message: "School not found!",
        data: false,
      });
    }

    return res
      .status(200)
      .json({ status: true, message: "School updated!", data: updatedSchool });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
const search = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Validate page and limit to be positive integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        status: false,
        message: "Page must be a positive integer.",
        data: false,
      });
    }

    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        status: false,
        message: "Limit must be a positive integer.",
        data: false,
      });
    }

    // Calculate the offset
    const skip = (pageNum - 1) * limitNum;

    // Build query conditionally based on the search parameter
    const query = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive name search
      : {}; // No filtering, fetch all records

    // Fetch schools with pagination and populate departments
    const schools = await School.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate("departments")
      .exec();
    // Count total documents matching the query
    const totalSchools = await School.countDocuments(query);

    // Handle empty results
    if (!schools.length) {
      return res.status(200).json({
        status: true,
        message: "No schools found.",
        data: {
          schools: [],
          total: totalSchools,
          page: pageNum,
          totalPages: Math.ceil(totalSchools / limitNum),
        },
      });
    }
    // Respond with paginated results
    return res.status(200).json({
      status: true,
      message: "Schools found.",
      data: {
        schools,
        total: totalSchools,
        page: pageNum,
        totalPages: Math.ceil(totalSchools / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in search API:", error);

    // Handle server errors
    return res.status(500).json({
      status: false,
      message: "An error occurred while processing the request.",
      data: false,
    });
  }
};
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.query;
    // Validate the school ID
    if (!id || mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        status: false,
        message: "Invalid school ID provided!",
        data: false,
      });
    }

    // Check if the school exists
    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        status: false,
        message: "School not found!",
        data: false,
      });
    }
    school.deleteflag = true;
    school.status = false;
    // Delete the school
    await school.save();

    const departments = await Departments.find({ school: id });
    departments.forEach(async (department) => {
      department.deleteflag = true;
      department.status = false;
      await department.save();
    });
    
    const faculty = await Faculty.find({
      school: id,
      status: true,
      deleteflag: false,
    });

    faculty.forEach(async (faculty) => {
      faculty.status = false;
      faculty.deleteflag = true;
      faculty.save();
    });

    return res.status(200).json({
      status: true,
      message: "School deleted successfully!",
      data: true,
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error. " + error.message,
      data: false,
    });
  }
};
module.exports = {
  create,
  findAll,
  findById,
  update,
  search,
  deleteSchool,
};

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

    // Ensure page and limit are positive integers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        status: false,
        message: "Page and limit must be positive integers",
        data: false,
      });
    }

    // Calculate the offset
    const skip = (pageNum - 1) * limitNum;

    // Build query conditionally based on the search parameter
    const query = search
      ? { name: { $regex: search, $options: "i" } } // Search by name
      : {}; // Fetch all records

    // Fetch schools with pagination
    const schools = await School.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate("departments")
      .exec();

    // Check if any schools were found
    if (!schools.length) {
      return res
        .status(204)
        .json({ status: false, message: "No schools found", data: false });
    }

    // Count total schools matching the criteria
    const totalSchools = await School.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: "Schools found",
      data: {
        schools,
        total: totalSchools,
        page: pageNum,
        totalPages: Math.ceil(totalSchools / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
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
};

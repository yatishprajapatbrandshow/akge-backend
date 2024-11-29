const { Faculty, Departments } = require("../models");
const mongoose = require("mongoose");

const create = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      designation,
      department,
      phoneNumber,
      address,
      dateOfBirth,
      hireDate,
      salary,
      subjectsTaught,
      researchInterests,
      profilePicture,
      socialLinks,
    } = req.body;

    // Validate the request
    if (
      !firstName ||
      !email ||
      !phoneNumber ||
      !subjectsTaught ||
      !designation
      // !department
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }
    let departmentExists;
    // validate department
    if (department) {
      if (mongoose.Types.ObjectId.isValid(department) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid faculty _id!",
          data: false,
        });
      } else {
        departmentExists = await Departments.findOne({ _id: department });
        if (!departmentExists) {
          return res.status(400).json({
            status: false,
            message: "Department does not exist! with this id : " + department,
            data: false,
          });
        }
      }
    }
    // Create a new faculty
    const faculty = new Faculty({
      firstName,
      lastName,
      email,
      designation,
      department,
      phoneNumber,
      address,
      dateOfBirth,
      hireDate,
      salary,
      subjectsTaught,
      researchInterests,
      profilePicture,
      socialLinks,
      status: true,
      deleteflag: false,
    });
    // Save the faculty
    await faculty.save();
    if (departmentExists) {
      departmentExists?.faculty.push(faculty._id);
      await departmentExists.save();
    }
    return res.status(201).json({
      status: true,
      message: "Faculty created successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const update = async (req, res) => {
  try {
    const {
      _id,
      firstName,
      lastName,
      email,
      designation,
      department,
      phoneNumber,
      address,
      dateOfBirth,
      hireDate,
      salary,
      subjectsTaught,
      researchInterests,
      profilePicture,
      socialLinks,
    } = req.body;
    // Validate the _id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }
    const checkFaculty = await Faculty.findOne({ _id });
    if (!checkFaculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    let departmentExists;
    // validate department
    if (department) {
      if (mongoose.Types.ObjectId.isValid(department) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid faculty _id!",
          data: false,
        });
      } else {
        departmentExists = await Departments.findOne({ _id: department });
        if (!departmentExists) {
          return res.status(400).json({
            status: false,
            message: "Department does not exist! with this id : " + department,
            data: false,
          });
        }
      }
    }
    if (
      departmentExists._id.toString() !== checkFaculty.department.toString()
    ) {
      const oldDepartment = await Departments.findById(checkFaculty.department);
      if (oldDepartment) {
        oldDepartment.faculty = oldDepartment.faculty.filter(
          (faculty) => faculty.toString() !== _id
        );
        await oldDepartment.save();
      }
      departmentExists.faculty.push(_id);
      await departmentExists.save();
    }

    // Update the faculty
    const faculty = await Faculty.findOneAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        email,
        designation,
        department,
        phoneNumber,
        address,
        dateOfBirth,
        hireDate,
        salary,
        subjectsTaught,
        researchInterests,
        profilePicture,
        socialLinks,
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const getAll = async (req, res) => {
  try {
    const faculty = await Faculty.find({
      deleteflag: false,
      status: true,
    }).populate("department");

    if (!faculty || faculty.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const findById = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }
    const faculty = await Faculty.findOne({
      _id,
      deleteflag: false,
      status: true,
    }).populate("department");
    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const getByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        status: false,
        message: "Invalid department _id!",
        data: false,
      });
    }
    const faculty = await Faculty.find({
      department,
      deleteflag: false,
      status: true,
    }).populate("department");

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const search = async (req, res) => {
  try {
    const { search } = req.query;
    const faculty = await Faculty.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { dateOfBirth: { $regex: search, $options: "i" } },
        { hireDate: { $regex: search, $options: "i" } },
        { salary: { $regex: search, $options: "i" } },
        { subjectsTaught: { $regex: search, $options: "i" } },
        { researchInterests: { $regex: search, $options: "i" } },
        { profilePicture: { $regex: search, $options: "i" } },
        { socialLinks: { $regex: search, $options: "i" } },
      ],
      deleteflag: false,
      status: true,
    }).populate("department");

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
const deleteFaculty = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }
    const faculty = await Faculty.findOneAndUpdate(
      { _id },
      { deleteflag: true, status: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    const department = await Departments.findById(faculty.department);
    if (department) {
      department.faculty = department.faculty.filter(
        (faculty) => faculty.toString() !== _id
      );
      await department.save();
    }
    return res.status(200).json({
      status: true,
      message: "Faculty deleted successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};
module.exports = {
  create,
  update,
  findById,
  getAll,
  getByDepartment,
  search,
  deleteFaculty,
};

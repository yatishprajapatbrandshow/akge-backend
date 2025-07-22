const { default: mongoose } = require("mongoose");
const { Departments, School, Faculty } = require("../models");

const create = async (req, res) => {
  try {
    const {
      name,
      school,
      description,
      // headOfDepartment,
      programsOffered,
    } = req.body;

    // Validate required fields
    const missings = [];
    if (!name) missings.push("name");
    // if (!headOfDepartment) missings.push("headOfDepartment");
    if (!programsOffered) missings.push("programsOffered");
    if (!school) missings.push("school");
    if (!description) missings.push("description");
    if (missings.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields! " + missings.join(", "),
        data: missings,
      });
    }
    let schoolExists;
    if (school) {
      if (mongoose.Types.ObjectId.isValid(school) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid school _id!",
          data: false,
        });
      } else {
        schoolExists = await School.findOne({ _id: school });
        if (!schoolExists) {
          return res.status(400).json({
            status: false,
            message: "School does not exist!",
            data: false,
          });
        }
      }
    }
    // if (headOfDepartment) {
    //   if (mongoose.Types.ObjectId.isValid(headOfDepartment) === false) {
    //     return res.status(400).json({
    //       status: false,
    //       message: "Invalid headOfDepartment _id!",
    //       data: false,
    //     });
    //   } else {
    //     const facultyExists = await Faculty.findOne({ _id: headOfDepartment });
    //     if (!facultyExists) {
    //       return res.status(400).json({
    //         status: false,
    //         message: "Faculty does not exist!",
    //         data: false,
    //       });
    //     }
    //   }
    // }
    // Check for duplicate department
    const departmentExists = await Departments.findOne({
      name,
    }).exec();
    if (departmentExists) {
      return res.status(400).json({
        status: false,
        message: "Department already exists!",
        data: false,
      });
    }

    // Create and save new department
    const department = new Departments({
      name,
      school,
      description,
      // headOfDepartment,
      programsOffered,
      status: true,
      deleteflg: false,
    });
    const saved = await department.save();
    if (!schoolExists.departments.includes(saved._id)) {
      schoolExists.departments.push(saved._id); // Add department if it's not already in the list
      await schoolExists.save(); // Save the updated school object
    }
    if (saved) {
      return res.status(201).json({
        status: true,
        message: "Department created successfully!",
        data: saved,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to create department!",
        data: false,
      });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(500).json({
      status: false,
      message: error.message,
      data: false,
    });
  }
};
const update = async (req, res) => {
  try {
    const {
      _id,
      name,
      school,
      description,
      // headOfDepartment,
      programsOffered,
      faculty,
    } = req.body;
    // add validation for required fields
    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "_id can not be empty!",
        data: false,
      });
    }
    let departmentExists;
    // validate department
    if (mongoose.Types.ObjectId.isValid(_id) === false) {
      return res.status(400).json({
        status: false,
        message: "Invalid department _id!",
        data: false,
      });
    } else {
      departmentExists = await Departments.findOne({
        _id,
        status: true,
        deleteflag: false,
      });
      if (!departmentExists) {
        return res.status(400).json({
          status: false,
          message: "Department does not exist!",
          data: false,
        });
      }
    }
    let schoolExists;
    // validate school
    if (school) {
      if (mongoose.Types.ObjectId.isValid(school) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid school _id!",
          data: false,
        });
      } else {
        schoolExists = await School.findOne({ _id: school });
        if (!schoolExists) {
          return res.status(400).json({
            status: false,
            message: "School does not exist!",
            data: false,
          });
        }
      }
    }
    // validate headOfDepartment
    // if (headOfDepartment) {
    //   if (mongoose.Types.ObjectId.isValid(headOfDepartment) === false) {
    //     return res.status(400).json({
    //       status: false,
    //       message: "Invalid headOfDepartment _id!",
    //       data: false,
    //     });
    //   } else {
    //     const facultyExists = await Faculty.findOne({ _id: headOfDepartment });
    //     if (!facultyExists) {
    //       return res.status(400).json({
    //         status: false,
    //         message: "HeadOfDepartment with _id does not exist!",
    //         data: false,
    //       });
    //     }
    //   }
    // }
    // validate faculty
    if (faculty) {
      if (faculty.length > 0) {
        faculty.forEach(async (fac) => {
          if (mongoose.Types.ObjectId.isValid(fac) === false) {
            return res.status(400).json({
              status: false,
              message: "Invalid faculty _id!",
              data: false,
            });
          } else {
            const facultyExists = await Faculty.findOne({ _id: fac });
            if (!facultyExists) {
              return res.status(400).json({
                status: false,
                message: "Faculty does not exist! with this id : " + fac,
                data: false,
              });
            }
          }
        });
      }
    }
    // Check if departments school id is the same as the school id
    if (schoolExists._id.toString() !== departmentExists.school.toString()) {
      const schoolExists1 = await School.findOne({
        _id: departmentExists.school,
      });
      schoolExists1.departments = schoolExists1.departments.filter(
        (dep) => dep.toString() !== departmentExists._id.toString()
      );
      await schoolExists1.save();
    }

    // Update department
    const updated = await Departments.findOneAndUpdate(
      { _id },
      {
        name,
        school,
        description,
        // headOfDepartment,
        programsOffered,
        faculty,
      },
      { new: true }
    ).exec();
    // check unique
    if (!schoolExists.departments.includes(_id)) {
      schoolExists.departments.push(_id);
      await schoolExists.save();
    }
    if (updated) {
      return res.status(200).json({
        status: true,
        message: "Department updated successfully!",
        data: updated,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to update department!",
        data: false,
      });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(500).json({
      status: false,
      message: error.message,
      data: false,
    });
  }
};
const findAll = async (req, res) => {
  try {
    // Fetch all departments with status true and deleteflag false
    const departments = await Departments.find({
      status: true,
      deleteflag: false,
    })
      .populate("school") // Populate school data if it's a reference field
      .populate("faculty") // Populate faculty data if applicable
      .exec();

    // Check if departments exist
    if (departments && departments.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Departments retrieved successfully!",
        data: departments,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No departments found!",
        data: [],
      });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    // Return error response if something goes wrong
    return res.status(500).json({
      status: false,
      message: `Error retrieving departments: ${error.message}`,
      data: false,
    });
  }
};
const findById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Department ID is required!",
        data: false,
      });
    }
    // Fetch department by id
    const department = await Departments.findOne({
      _id: id,
      status: true,
      deleteflag: false,
    })
      .populate("school") // Populate school data if it's a reference field
      .populate("faculty") // Populate faculty data if applicable
      .exec();
    // Check if department exists
    if (department) {
      return res.status(200).json({
        status: true,
        message: "Department retrieved successfully!",
        data: department,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Department not found!",
        data: false,
      });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    // Return error response if something goes wrong
    return res.status(500).json({
      status: false,
      message: `Error retrieving department: ${error.message}`,
      data: false,
    });
  }
};
const getbySchool = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "School ID is required!",
        data: false,
      });
    }
    // validate school
    if (id) {
      if (mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid school _id!",
          data: false,
        });
      } else {
        const schoolExists = await School.findOne({ _id: id });
        if (!schoolExists) {
          return res.status(400).json({
            status: false,
            message: "School does not exist!",
            data: false,
          });
        }
      }
    }
    // Fetch department by id
    const department = await Departments.find({
      school: id,
      status: true,
      deleteflag: false,
    })
      .populate("school") // Populate school data if it's a reference field
      .populate("faculty") // Populate faculty data if applicable
      .exec();
    // Check if department exists
    if (department) {
      return res.status(200).json({
        status: true,
        message: "Department retrieved successfully!",
        data: department,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Department not found!",
        data: false,
      });
    }
  } catch (error) {
    // Return error response if something goes wrong
    return res.status(500).json({
      status: false,
      message: `Error retrieving department: ${error.message}`,
      data: false,
    });
  }
};
const search = async (req, res) => {
  try {
    const { search, school_id } = req.query;
    if (!search) {
      return res.status(400).json({
        status: false,
        message: "Search key is required!",
        data: false,
      });
    }
    if (school_id) {
      if (mongoose.Types.ObjectId.isValid(school_id) === false) {
        return res.status(400).json({
          status: false,
          message: "Invalid school _id!",
          data: false,
        });
      } else {
        const schoolExists = await School.findOne({ _id: school_id });
        if (!schoolExists) {
          return res.status(400).json({
            status: false,
            message: "School does not exist!",
            data: false,
          });
        }
      }
    }
    const query = {};
    if (school_id) {
      query.school = school_id;
    }
    if (!search) {
      return res.status(400).json({
        status: false,
        message: "Search key is required!",
        data: false,
      });
    }
    const departments = await Departments.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
      query,
      status: true,
      deleteflag: false,
    })
      .populate("school") // Populate school data if it's a reference field
      .populate("faculty") // Populate faculty data if applicable
      .exec();
    // Check if department exists
    if (departments) {
      return res.status(200).json({
        status: true,
        message: "Department retrieved successfully!",
        data: departments,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Department not found!",
        data: false,
      });
    }
  } catch (error) {
    // Return error response if something goes wrong
    return res.status(500).json({
      status: false,
      message: `Error retrieving department: ${error.message}`,
      data: false,
    });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Department ID is required!",
        data: false,
      });
    }
    // Fetch department by id
    const department = await Departments.findOne({
      _id: id,
      status: true,
      deleteflag: false,
    }).exec();
    // Check if department exists
    if (department) {
      department.deleteflag = true;
      department.status = false;
      await department.save();

      const schoolExists = await School.findOne({ _id: department.school });
      schoolExists.departments = schoolExists.departments.filter(
        (dep) => dep.toString() !== department._id.toString()
      );
      await schoolExists.save();

      // Remove from the faculty
      if (department.faculty.length > 0) {
        department.faculty.forEach(async (fac) => {
          const facultyExists = await Faculty.findOne({ _id: fac });
          facultyExists.department = facultyExists.department.filter(
            (dep) => dep.toString() !== department._id.toString()
          );
          await facultyExists.save();
        });
      }

      return res.status(200).json({
        status: true,
        message: "Department deleted successfully!",
        data: department,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Department not found!",
        data: false,
      });
    }
  } catch (error) {
    // Return error response if something goes wrong
    return res.status(500).json({
      status: false,
      message: `Error deleting department: ${error.message}`,
      data: false,
    });
  }
};
module.exports = {
  create,
  findAll,
  findById,
  update,
  getbySchool,
  search,
  deleteDepartment,
};

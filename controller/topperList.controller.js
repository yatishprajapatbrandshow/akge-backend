const { default: mongoose } = require("mongoose");
const { Toppers } = require("../models");

const create = async (req, res) => {
  try {
    const {
      name,
      lastName,
      rollNo,
      school,
      department,
      batch,
      examName,
      subjectWiseMarks,
      totalMarks,
      grade,
      topperCategory,
      rank,
      percentage,
      remarks,
      award,
      awardedOn,
      profileImage,
      guardianContact,
    } = req.body;

    // Validate required fields
    const missings = [];
    if (!name) missings.push("name");
    if (!rollNo) missings.push("rollNo");
    if (!school) missings.push("school");
    if (!department) missings.push("department");
    if (!examName) missings.push("examName");
    if (!subjectWiseMarks) missings.push("subjectWiseMarks");
    if (!totalMarks) missings.push("totalMarks");
    if (!grade) missings.push("grade");
    if (!rank) missings.push("rank");
    if (!percentage) missings.push("percentage");
    if (missings.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Missing Required Fields! " + missings.join(", "),
        data: missings,
      });
    }

    // Check for duplicate roll number
    const topperExists = await Toppers.findOne({ rollNo });
    if (topperExists) {
      return res.status(400).json({
        status: false,
        message: "Topper already exists!",
        data: false,
      });
    }
    // Create and save new topper
    const topper = new Toppers({
      name,
      lastName,
      rollNo,
      school,
      department,
      batch,
      examName,
      subjectWiseMarks,
      totalMarks,
      grade,
      topperCategory,
      rank,
      percentage,
      remarks,
      award,
      awardedOn,
      profileImage,
      guardianContact,
    });

    const saved = await topper.save();
    return res
      .status(201)
      .json({ status: true, message: "Topper created!", data: saved });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: false });
  }
};
const update = async (req, res) => {
  try {
    const {
      id,
      name,
      lastName,
      rollNo,
      school,
      department,
      batch,
      examName,
      subjectWiseMarks,
      totalMarks,
      grade,
      topperCategory,
      rank,
      percentage,
      remarks,
      award,
      awardedOn,
      profileImage,
      guardianContact,
    } = req.body;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Missing Required Fields! id",
        data: false,
      });
    }
    let topper;
    // validate topper id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid School ID",
        data: false,
      });
    } else {
      topper = await Toppers.findById(id);
      if (!topper) {
        return res.status(404).json({
          status: false,
          message: "Topper not found!",
          data: false,
        });
      }
    }

    // const topper = await Toppers.findById(id);
    // if (!topper) {
    //   return res.status(404).json({
    //     status: false,
    //     message: "Topper not found!",
    //     data: false,
    //   });
    // }

    // Update topper
    if (name) topper.name = name;
    if (lastName) topper.lastName = lastName;
    if (rollNo) topper.rollNo = rollNo;
    if (school) topper.school = school;
    if (department) topper.department = department;
    if (batch) topper.batch = batch;
    if (examName) topper.examName = examName;
    if (subjectWiseMarks) topper.subjectWiseMarks = subjectWiseMarks;
    if (totalMarks) topper.totalMarks = totalMarks;
    if (grade) topper.grade = grade;
    if (topperCategory) topper.topperCategory = topperCategory;
    if (rank) topper.rank = rank;
    if (percentage) topper.percentage = percentage;
    if (remarks) topper.remarks = remarks;
    if (award) topper.award = award;
    if (awardedOn) topper.awardedOn = awardedOn;
    if (profileImage) topper.profileImage = profileImage;
    if (guardianContact) topper.guardianContact = guardianContact;

    const updated = await topper.save();
    return res
      .status(200)
      .json({ status: true, message: "Topper updated!", data: updated });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: false });
  }
};
// get all with rank
const getAll = async (req, res) => {
  try {
    // Get `page` and `limit` from query parameters, with default values
    const page = parseInt(req.query.page, 10) || 1; // Default page is 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch toppers with pagination
    const toppers = await Toppers.find({ status: true, deleteflg: false })
      .sort({ rank: 1 })
      .skip(skip)
      .limit(limit);

    if (!toppers.length) {
      return res.status(404).json({
        status: false,
        message: "No Toppers found",
        data: false,
      });
    }

    // Fetch total count of toppers for pagination metadata
    const totalCount = await Toppers.countDocuments({
      status: true,
      deleteflg: false,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      message: "All Toppers found",
      data: toppers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        limit,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: false });
  }
};
// get topper by id
const getTopperByid = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Missing Required Fields! id",
        data: false,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Topper ID",
        data: false,
      });
    }
    const topper = await Toppers.findById(id);
    if (!topper) {
      return res.status(404).json({
        status: false,
        message: "Topper not found!",
        data: false,
      });
    }
    return res
      .status(200)
      .json({ status: true, message: "Topper found", data: topper });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: false });
  }
};
module.exports = {
  create,
  update,
  getAll,
  getTopperByid,
};

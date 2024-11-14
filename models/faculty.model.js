const { default: mongoose } = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    designation: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to the Department model
      // required: true,
    },
    phoneNumber: String,
    address: Object,
    dateOfBirth: Date, // Date of birth of the faculty member
    hireDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: true,
    },
    subjectsTaught: [String], // List of subjects taught by the faculty
    researchInterests: [String], // List of research interests
    // officeLocation: String, // Office location within the department
    //   isTenured: {
    //     type: Boolean,
    //     default: false, // Whether the faculty member has tenure
    //   },
    profilePicture: String, // URL or path to faculty profile picture
    socialLinks: [],
    status: {
      type: Boolean,
      default: true,
    },
    deleteflag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
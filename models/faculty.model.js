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
    },
    designation: String,
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department", // Reference to the Department model
        // required: true, // Ensures at least one department is assigned
      },
    ],
    school: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School", // Reference to the School model
        // required: true, // Ensures at least one School is assigned
      },
    ],
    subjectsTaught: [String], // List of subjects taught by the faculty
    profilePicture: String, // URL or path to faculty profile picture
    socialLinks: [], // Array to hold social media links
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
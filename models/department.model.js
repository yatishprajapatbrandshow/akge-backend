const { default: mongoose } = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School", // Reference to the School model
    required: true,
  },
  description: String,
  departmentCode: {
    type: String, // Unique department code, e.g., 'CS01'
    required: true,
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty", // Reference to the Faculty model (Head of Department)
  },
  programsOffered: [String], // List of programs or degrees offered by the department
  faculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty", // Reference to the Faculty model
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  deleteflag: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
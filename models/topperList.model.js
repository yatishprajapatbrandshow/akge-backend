const mongoose = require("mongoose");

const topperListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    rollNo: {
      type: Number,
      required: true,
      unique: true, // Ensures unique roll numbers
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    batch: {
      type: String, // Added to specify the section (if applicable)
    },
    examName: {
      type: String, // Name of the exam (e.g., Midterm, Final)
      required: true,
    },
    subjectWiseMarks: {
      type: Map,
      of: Number, // Subject-wise marks, where key is subject name and value is marks
    },
    totalMarks: {
      type: Number,
      required: true, // Total marks obtained
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B", "C", "D", "E", "F"], // Grading system
      required: true,
    },
    topperCategory: {
      type: String,
      enum: [
        "School Level",
        "Class Level",
        "District Level",
        "State Level",
        "National Level",
      ],
      default: "School Level",
    },
    rank: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    award: {
      type: String,
    },
    awardedOn: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    guardianContact: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    deleteflg: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopperList", topperListSchema);

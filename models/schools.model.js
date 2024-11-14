const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: String,
    description: String,
    yearEstablished: {
      type: String,
      required: true,
    },
    schoolType: {
      type: String, // e.g., 'Public', 'Private', 'International'
      enum: ["Public", "Private", "International"],
      required: true,
    },
    accreditation: String, // Accreditation information, if applicable
    contactNumber: String,
    email: String,
    schoolCode: {
      type: String,
      required: true,
      unique: true,
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department", // Reference to the Department model
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
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

module.exports = School;
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
    accreditation: String, // Accreditation information, if applicable
    departments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department", // Reference to the Department model
        },
      ],
      default: []
    },
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
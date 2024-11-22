const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    sid: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startdate: {
      type: String,
      required: true,
    },
    enddate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["announcement"],
    },
    relatedLinks: {
      type: [{}],
    },
    pdf: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, timeseries: true }
);

module.exports = mongoose.model("announcement", announcementSchema);

const mongoose = require("mongoose");

const circulerSchema = new mongoose.Schema(
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
    featuredImage: {
      type: String,
    },
    galleryimg: {
      type: Array,
    },
    date: {
      type: String,
      required: true,
    },
    pageUrl: {
      type: String,
      required: true,
    },
    featured: {
      type: String,
      enum: ["Yes", "No"],
    },
    type: {
      type: String,
      enum: ["circuler", "article", "news", "event"],
    },
    tags: {
      type: [String],
    },
    relatedLinks: {
      type: [String],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, timeseries: true }
);

module.exports = mongoose.model("circuler", circulerSchema);

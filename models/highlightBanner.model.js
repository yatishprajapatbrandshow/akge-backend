const mongoose = require("mongoose");

const highlightBannerSchema = new mongoose.Schema(
  {
    pageid: {
      type: Number,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true
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

const HighlightBanner = mongoose.model(
  "highlightBanner",
  highlightBannerSchema
);

module.exports = HighlightBanner;

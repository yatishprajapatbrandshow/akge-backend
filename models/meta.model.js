const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
  {
    pageid: {
      type: Number,
      required: true,
    },
    metatitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: Array,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Meta = mongoose.model("meta", metaSchema);

module.exports = Meta;

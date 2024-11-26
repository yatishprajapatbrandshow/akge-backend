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

// Pre-save hook to auto-increment the order field
highlightBannerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const highestOrder = await HighlightBanner.findOne()
      .sort({ order: -1 })
      .select("order")
      .exec();
    this.order = highestOrder ? highestOrder.order + 1 : 1; // Default to 1 if no documents exist
  }
  next();
});

module.exports = HighlightBanner;

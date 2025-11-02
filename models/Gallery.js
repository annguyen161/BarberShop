/**
 * MongoDB Model: Gallery
 * Schema cho ảnh gallery của salon
 */

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Vui lòng thêm đường dẫn ảnh"],
      trim: true,
    },
    alt: {
      type: String,
      default: "Gallery image",
    },
    category: {
      type: String,
      enum: ["all", "toc", "uon", "nhuom", "other"],
      default: "all",
      required: [true, "Vui lòng chọn danh mục"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
gallerySchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);


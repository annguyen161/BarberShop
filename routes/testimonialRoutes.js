/**
 * Routes: Testimonial Routes
 * API endpoints cho đánh giá khách hàng
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Testimonial = require("../models/Testimonial");

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique: timestamp + original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filter để chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = file.mimetype.match(allowedTypes);
  const extname = path.extname(file.originalname).toLowerCase().match(allowedTypes);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// POST: Upload file ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không có file được upload",
      });
    }

    // Trả về URL của file đã upload
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Upload file thành công",
      data: {
        url: fileUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi upload file",
      error: error.message,
    });
  }
});

// GET: Lấy tất cả đánh giá
router.get("/", async (req, res) => {
  try {
    const { page } = req.query;
    const filter = { isActive: true };

    if (page) {
      filter.$or = [{ page: page }, { page: "both" }];
    }

    const testimonials = await Testimonial.find(filter).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đánh giá",
      error: error.message,
    });
  }
});

// GET: Lấy đánh giá theo trang (home/services)
router.get("/page/:page", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      $or: [{ page: req.params.page }, { page: "both" }],
      isActive: true,
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đánh giá theo trang",
      error: error.message,
    });
  }
});

// GET: Lấy đánh giá theo ID
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đánh giá",
      error: error.message,
    });
  }
});

// POST: Tạo đánh giá mới
router.post("/", async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo đánh giá thành công",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo đánh giá",
      error: error.message,
    });
  }
});

// PUT: Cập nhật đánh giá
router.put("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật đánh giá",
      error: error.message,
    });
  }
});

// DELETE: Xóa đánh giá
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      message: "Xóa đánh giá thành công",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đánh giá",
      error: error.message,
    });
  }
});

module.exports = router;

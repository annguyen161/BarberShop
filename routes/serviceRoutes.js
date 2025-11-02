/**
 * Routes: Service Routes
 * API endpoints cho dịch vụ
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Service = require("../models/Service");

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

// GET: Lấy tất cả dịch vụ
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách dịch vụ",
      error: error.message,
    });
  }
});

// GET: Lấy dịch vụ theo ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin dịch vụ",
      error: error.message,
    });
  }
});

// GET: Tìm kiếm dịch vụ
router.get("/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const services = await Service.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
      isActive: true,
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm dịch vụ",
      error: error.message,
    });
  }
});

// POST: Tạo dịch vụ mới
router.post("/", async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo dịch vụ",
      error: error.message,
    });
  }
});

// PUT: Cập nhật dịch vụ
router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật dịch vụ",
      error: error.message,
    });
  }
});

// DELETE: Xóa dịch vụ
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    res.json({
      success: true,
      message: "Xóa dịch vụ thành công",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa dịch vụ",
      error: error.message,
    });
  }
});

module.exports = router;

/**
 * Routes: Gallery Routes
 * API endpoints cho gallery
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");

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

// GET: Lấy tất cả ảnh gallery
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category && category !== "all") {
      query.category = category;
    }

    const galleries = await Gallery.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách gallery",
      error: error.message,
    });
  }
});

// GET: Lấy ảnh theo category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const galleries = await Gallery.find({
      category: category,
      isActive: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách gallery theo category",
      error: error.message,
    });
  }
});

// GET: Lấy ảnh theo ID
router.get("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh gallery",
      });
    }

    res.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin gallery",
      error: error.message,
    });
  }
});

// POST: Tạo ảnh gallery mới
router.post("/", async (req, res) => {
  try {
    const gallery = await Gallery.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo ảnh gallery thành công",
      data: gallery,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi tạo ảnh gallery",
      error: error.message,
    });
  }
});

// PUT: Cập nhật ảnh gallery
router.put("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh gallery",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật ảnh gallery thành công",
      data: gallery,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật ảnh gallery",
      error: error.message,
    });
  }
});

// DELETE: Xóa ảnh gallery
router.delete("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh gallery",
      });
    }

    res.json({
      success: true,
      message: "Xóa ảnh gallery thành công",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa ảnh gallery",
      error: error.message,
    });
  }
});

module.exports = router;


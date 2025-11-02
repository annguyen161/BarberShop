/**
 * Component: Gallery Management
 * Quản lý gallery với CRUD operations
 */

import React, { useState, useEffect } from "react";
import GalleryController from "../../controllers/GalleryController";

const GalleryManagement = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
    alt: "",
    category: "all",
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadGalleries();
  }, [filterCategory]);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const data = await GalleryController.getAllGalleries(
        filterCategory === "all" ? null : filterCategory
      );
      setGalleries(data);
    } catch (error) {
      showMessage("danger", "Không thể tải dữ liệu gallery");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleOpenModal = (gallery = null) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        image: gallery.image,
        alt: gallery.alt || "",
        category: gallery.category || "all",
        order: gallery.order || 0,
      });
    } else {
      setEditingGallery(null);
      setFormData({
        image: "",
        alt: "",
        category: "all",
        order: 0,
      });
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGallery(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let imageUrl = formData.image;

      // Nếu có file được chọn, upload file trước
      if (selectedFile) {
        imageUrl = await GalleryController.uploadImage(selectedFile);
      }

      const galleryData = {
        ...formData,
        image: imageUrl,
      };

      if (editingGallery) {
        await GalleryController.updateGallery(editingGallery._id, galleryData);
        showMessage("success", "Cập nhật ảnh gallery thành công!");
      } else {
        await GalleryController.createGallery(galleryData);
        showMessage("success", "Thêm ảnh gallery thành công!");
      }

      handleCloseModal();
      loadGalleries();
    } catch (error) {
      showMessage(
        "danger",
        editingGallery
          ? "Không thể cập nhật ảnh gallery"
          : "Không thể thêm ảnh gallery"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) {
      return;
    }

    try {
      await GalleryController.deleteGallery(id);
      showMessage("success", "Xóa ảnh gallery thành công!");
      loadGalleries();
    } catch (error) {
      showMessage("danger", "Không thể xóa ảnh gallery");
    }
  };

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "toc", name: "Tóc" },
    { id: "uon", name: "Uốn" },
    { id: "nhuom", name: "Nhuộm" },
    { id: "other", name: "Khác" },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h3>
          <i className="fa fa-images"></i> Quản Lý Gallery
        </h3>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa fa-plus"></i> Thêm Ảnh
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {/* Filter by Category */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "600" }}>
          Lọc theo danh mục:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "8px 15px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Alt Text</th>
              <th>Danh Mục</th>
              <th>Thứ Tự</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {galleries.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <i
                    className="fa fa-inbox"
                    style={{ fontSize: "48px", color: "#ccc" }}
                  ></i>
                  <p style={{ marginTop: "15px", color: "#999" }}>
                    Chưa có ảnh nào trong danh mục này
                  </p>
                </td>
              </tr>
            ) : (
              galleries.map((gallery) => (
                <tr key={gallery._id}>
                  <td>
                    <img
                      src={gallery.image}
                      alt={gallery.alt || "Gallery image"}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td>{gallery.alt || "N/A"}</td>
                  <td>
                    <span className="status-badge active">
                      {
                        categories.find((cat) => cat.id === gallery.category)
                          ?.name || gallery.category
                      }
                    </span>
                  </td>
                  <td>{gallery.order}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleOpenModal(gallery)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(gallery._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>
                {editingGallery ? "Chỉnh Sửa Ảnh Gallery" : "Thêm Ảnh Mới"}
              </h4>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Danh Mục *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hình Ảnh *</label>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor="gallery-file-upload"
                    className="btn btn-secondary"
                    style={{
                      display: "inline-block",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fa fa-upload"></i> Chọn File
                  </label>
                  <input
                    id="gallery-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {selectedFile && (
                    <span style={{ marginLeft: "10px", color: "#28a745" }}>
                      <i className="fa fa-check"></i> {selectedFile.name}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#6c757d",
                  }}
                >
                  Hoặc
                </div>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Nhập URL hình ảnh (ví dụ: /uploads/image.jpg hoặc assets/images/g1.jpg)"
                  required={!selectedFile}
                />
                {(formData.image || selectedFile) && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : formData.image
                      }
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Alt Text (không bắt buộc)</label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleChange}
                  placeholder="Mô tả ảnh cho SEO"
                />
              </div>

              <div className="form-group">
                <label>Thứ Tự</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  placeholder="Số càng nhỏ, hiển thị càng trước"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                      ></span>
                      Đang xử lý...
                    </>
                  ) : editingGallery ? (
                    "Cập Nhật"
                  ) : (
                    "Thêm Mới"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;


/**
 * Component: Testimonials Management
 * Quản lý đánh giá khách hàng với CRUD operations
 */

import React, { useState, useEffect } from "react";
import TestimonialController from "../../controllers/TestimonialController";

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    image: "",
    rating: 5,
    page: "both",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await TestimonialController.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      showMessage("danger", "Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        comment: testimonial.comment,
        image: testimonial.image,
        rating: testimonial.rating,
        page: testimonial.page,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        comment: "",
        image: "",
        rating: 5,
        page: "both",
      });
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // Không set vào formData.image để giữ URL text input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let imageUrl = formData.image;

      // Nếu có file được chọn, upload file trước
      if (selectedFile) {
        try {
          imageUrl = await TestimonialController.uploadImage(selectedFile);
          showMessage("success", "Upload ảnh thành công!");
        } catch (error) {
          showMessage("danger", "Lỗi khi upload ảnh. Vui lòng thử lại!");
          setUploading(false);
          return;
        }
      }

      const submitData = {
        ...formData,
        image: imageUrl,
      };

      if (editingTestimonial) {
        await TestimonialController.updateTestimonial(
          editingTestimonial._id,
          submitData
        );
        showMessage("success", "Cập nhật đánh giá thành công!");
      } else {
        await TestimonialController.createTestimonial(submitData);
        showMessage("success", "Thêm đánh giá mới thành công!");
      }

      handleCloseModal();
      loadTestimonials();
    } catch (error) {
      showMessage("danger", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      try {
        await TestimonialController.deleteTestimonial(id);
        showMessage("success", "Xóa đánh giá thành công!");
        loadTestimonials();
      } catch (error) {
        showMessage("danger", "Không thể xóa đánh giá!");
      }
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i
          key={i}
          className={`fa fa-star${i < rating ? "" : "-o"}`}
          style={{ color: "#ffc107", marginRight: "3px" }}
        ></i>
      ));
  };

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
          <i className="fa fa-star"></i> Quản Lý Đánh Giá
        </h3>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa fa-plus"></i> Thêm Đánh Giá
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Đánh Giá</th>
              <th>Rating</th>
              <th>Hiển Thị</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <i
                    className="fa fa-inbox"
                    style={{ fontSize: "48px", color: "#ccc" }}
                  ></i>
                  <p style={{ marginTop: "15px", color: "#999" }}>
                    Chưa có đánh giá nào
                  </p>
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td>
                    <img src={testimonial.image} alt={testimonial.name} />
                  </td>
                  <td>{testimonial.name}</td>
                  <td style={{ maxWidth: "300px" }}>
                    {testimonial.comment.substring(0, 60)}...
                  </td>
                  <td>{renderStars(testimonial.rating)}</td>
                  <td>
                    <span className="status-badge active">
                      {testimonial.page}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleOpenModal(testimonial)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(testimonial._id)}
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
                {editingTestimonial
                  ? "Chỉnh Sửa Đánh Giá"
                  : "Thêm Đánh Giá Mới"}
              </h4>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Khách Hàng *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội Dung Đánh Giá *</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Ảnh *</label>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor="testimonial-file-upload"
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
                    id="testimonial-file-upload"
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
                  placeholder="Nhập URL hình ảnh (ví dụ: /uploads/image.jpg hoặc assets/images/test1.jpg)"
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
                <label>Số Sao *</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >
                  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 ⭐⭐⭐⭐</option>
                  <option value={3}>3 ⭐⭐⭐</option>
                  <option value={2}>2 ⭐⭐</option>
                  <option value={1}>1 ⭐</option>
                </select>
              </div>

              <div className="form-group">
                <label>Hiển Thị Tại *</label>
                <select
                  name="page"
                  value={formData.page}
                  onChange={handleChange}
                  required
                >
                  <option value="both">Cả Hai Trang</option>
                  <option value="home">Chỉ Trang Chủ</option>
                  <option value="services">Chỉ Trang Dịch Vụ</option>
                </select>
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
                  ) : editingTestimonial ? (
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

export default TestimonialsManagement;

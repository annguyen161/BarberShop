/**
 * Component: Services Management
 * Quản lý dịch vụ với CRUD operations
 */

import React, { useState, useEffect } from "react";
import ServiceController from "../../controllers/ServiceController";

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "other",
    price: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await ServiceController.getAllServices();
      setServices(data);
    } catch (error) {
      showMessage("danger", "Không thể tải dữ liệu dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        image: service.image,
        category: service.category,
        price: service.price || "",
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        image: "",
        category: "other",
        price: "",
      });
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          imageUrl = await ServiceController.uploadImage(selectedFile);
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
        price: formData.price ? Number(formData.price) : null,
      };

      if (editingService) {
        await ServiceController.updateService(editingService._id, submitData);
        showMessage("success", "Cập nhật dịch vụ thành công!");
      } else {
        await ServiceController.createService(submitData);
        showMessage("success", "Thêm dịch vụ mới thành công!");
      }

      handleCloseModal();
      loadServices();
    } catch (error) {
      showMessage("danger", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await ServiceController.deleteService(id);
        showMessage("success", "Xóa dịch vụ thành công!");
        loadServices();
      } catch (error) {
        showMessage("danger", "Không thể xóa dịch vụ!");
      }
    }
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
          <i className="fa fa-scissors"></i> Quản Lý Dịch Vụ
        </h3>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa fa-plus"></i> Thêm Dịch Vụ
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tên Dịch Vụ</th>
              <th>Mô Tả</th>
              <th>Danh Mục</th>
              <th>Giá</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
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
                    Chưa có dịch vụ nào
                  </p>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <img src={service.image} alt={service.name} />
                  </td>
                  <td>{service.name}</td>
                  <td style={{ maxWidth: "300px" }}>
                    {service.description.substring(0, 80)}...
                  </td>
                  <td>
                    <span className="status-badge active">
                      {service.category}
                    </span>
                  </td>
                  <td>{service.price ? `$${service.price}` : "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleOpenModal(service)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(service._id)}
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
                {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
              </h4>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Dịch Vụ *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô Tả *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Hình Ảnh *</label>
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor="file-upload"
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
                    id="file-upload"
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
                  placeholder="Nhập URL hình ảnh (ví dụ: /uploads/image.jpg hoặc assets/images/service.jpg)"
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
                <label>Danh Mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="haircut">Haircut</option>
                  <option value="beard">Beard</option>
                  <option value="coloring">Coloring</option>
                  <option value="styling">Styling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Giá (không bắt buộc)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
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
                  ) : editingService ? (
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

export default ServicesManagement;

/**
 * Controller: ServiceController
 * Xử lý logic nghiệp vụ liên quan đến dịch vụ
 * Fetch data từ MongoDB API
 */

import api, { API_ENDPOINTS } from "../config/api";

class ServiceController {
  // Lấy tất cả dịch vụ từ API
  async getAllServices() {
    try {
      const response = await api.get(API_ENDPOINTS.SERVICES);
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  // Lấy dịch vụ theo ID từ API
  async getServiceById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.SERVICE_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("Error fetching service by id:", error);
      throw error;
    }
  }

  // Tìm kiếm dịch vụ từ API
  async searchServices(keyword) {
    try {
      const response = await api.get(API_ENDPOINTS.SEARCH_SERVICES(keyword));
      return response.data;
    } catch (error) {
      console.error("Error searching services:", error);
      throw error;
    }
  }

  // Tạo dịch vụ mới
  async createService(serviceData) {
    try {
      const response = await api.post(API_ENDPOINTS.SERVICES, serviceData);
      return response;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  // Cập nhật dịch vụ
  async updateService(id, serviceData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.SERVICE_BY_ID(id),
        serviceData
      );
      return response;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  }

  // Xóa dịch vụ
  async deleteService(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.SERVICE_BY_ID(id));
      return response;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }

  // Upload file ảnh
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(API_ENDPOINTS.UPLOAD_SERVICE_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // API interceptor đã extract response.data, nên response ở đây là response.data từ server
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ServiceController();

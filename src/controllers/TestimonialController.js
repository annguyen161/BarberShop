/**
 * Controller: TestimonialController
 * Xử lý logic nghiệp vụ liên quan đến đánh giá khách hàng
 * Fetch data từ MongoDB API
 */

import api, { API_ENDPOINTS } from "../config/api";

class TestimonialController {
  // Lấy tất cả đánh giá từ API
  async getAllTestimonials(page = null) {
    try {
      let url = API_ENDPOINTS.TESTIMONIALS;
      if (page) {
        url += `?page=${page}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  }

  // Lấy đánh giá cho trang Home
  async getHomeTestimonials() {
    try {
      const response = await api.get(
        API_ENDPOINTS.TESTIMONIALS_BY_PAGE("home")
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching home testimonials:", error);
      throw error;
    }
  }

  // Lấy đánh giá cho trang Services
  async getServicesTestimonials() {
    try {
      const response = await api.get(
        API_ENDPOINTS.TESTIMONIALS_BY_PAGE("services")
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching services testimonials:", error);
      throw error;
    }
  }

  // Lấy đánh giá theo ID
  async getTestimonialById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.TESTIMONIAL_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("Error fetching testimonial by id:", error);
      throw error;
    }
  }

  // Tạo đánh giá mới
  async createTestimonial(testimonialData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.TESTIMONIALS,
        testimonialData
      );
      return response;
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  }

  // Cập nhật đánh giá
  async updateTestimonial(id, testimonialData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.TESTIMONIAL_BY_ID(id),
        testimonialData
      );
      return response;
    } catch (error) {
      console.error("Error updating testimonial:", error);
      throw error;
    }
  }

  // Xóa đánh giá
  async deleteTestimonial(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.TESTIMONIAL_BY_ID(id));
      return response;
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      throw error;
    }
  }

  // Upload file ảnh
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(API_ENDPOINTS.UPLOAD_TESTIMONIAL_IMAGE, formData, {
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
export default new TestimonialController();

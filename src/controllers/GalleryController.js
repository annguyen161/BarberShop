/**
 * Controller: GalleryController
 * Xử lý logic nghiệp vụ liên quan đến gallery
 * Fetch data từ MongoDB API
 */

import api, { API_ENDPOINTS } from "../config/api";

class GalleryController {
  // Lấy tất cả ảnh gallery từ API
  async getAllGalleries(category = null) {
    try {
      const endpoint = category 
        ? `${API_ENDPOINTS.GALLERIES}?category=${category}`
        : API_ENDPOINTS.GALLERIES;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching galleries:", error);
      throw error;
    }
  }

  // Lấy ảnh theo category từ API
  async getGalleriesByCategory(category) {
    try {
      const response = await api.get(API_ENDPOINTS.GALLERIES_BY_CATEGORY(category));
      return response.data;
    } catch (error) {
      console.error("Error fetching galleries by category:", error);
      throw error;
    }
  }

  // Lấy ảnh theo ID từ API
  async getGalleryById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.GALLERY_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("Error fetching gallery by id:", error);
      throw error;
    }
  }

  // Tạo ảnh gallery mới
  async createGallery(galleryData) {
    try {
      const response = await api.post(API_ENDPOINTS.GALLERIES, galleryData);
      return response;
    } catch (error) {
      console.error("Error creating gallery:", error);
      throw error;
    }
  }

  // Cập nhật ảnh gallery
  async updateGallery(id, galleryData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.GALLERY_BY_ID(id),
        galleryData
      );
      return response;
    } catch (error) {
      console.error("Error updating gallery:", error);
      throw error;
    }
  }

  // Xóa ảnh gallery
  async deleteGallery(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.GALLERY_BY_ID(id));
      return response;
    } catch (error) {
      console.error("Error deleting gallery:", error);
      throw error;
    }
  }

  // Upload file ảnh
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(API_ENDPOINTS.UPLOAD_GALLERY_IMAGE, formData, {
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
export default new GalleryController();


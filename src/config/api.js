/**
 * API Configuration
 * Cấu hình cho API endpoints
 */

import axios from "axios";

// Base URL cho API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Có thể thêm token authentication ở đây nếu cần
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi global
    if (error.response) {
      // Server trả về error response
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Network Error:", error.request);
    } else {
      // Lỗi khác
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Services
  SERVICES: "/services",
  SERVICE_BY_ID: (id) => `/services/${id}`,
  SEARCH_SERVICES: (keyword) => `/services/search/${keyword}`,
  UPLOAD_SERVICE_IMAGE: "/services/upload",

  // Prices
  PRICES: "/prices",
  PRICES_BY_CATEGORY: (category) => `/prices/category/${category}`,
  PRICE_BY_ID: (id) => `/prices/${id}`,

  // Testimonials
  TESTIMONIALS: "/testimonials",
  TESTIMONIALS_BY_PAGE: (page) => `/testimonials/page/${page}`,
  TESTIMONIAL_BY_ID: (id) => `/testimonials/${id}`,
  UPLOAD_TESTIMONIAL_IMAGE: "/testimonials/upload",

  // Banners
  BANNERS: "/banners",
  BANNER_BY_ID: (id) => `/banners/${id}`,

  // Contact
  CONTACTS: "/contacts",
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
  NEWSLETTER: "/contacts/newsletter",

  // Health
  HEALTH: "/health",
};

export default api;

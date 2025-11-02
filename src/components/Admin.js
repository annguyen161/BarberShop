/**
 * Component: Admin Dashboard
 * Trang quản trị với authentication và các chức năng CRUD
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ServicesManagement from "./admin/ServicesManagement";
import PricesManagement from "./admin/PricesManagement";
import TestimonialsManagement from "./admin/TestimonialsManagement";
import ContactsManagement from "./admin/ContactsManagement";
import GalleryManagement from "./admin/GalleryManagement";
import "./admin/AdminStyles.css";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminUsername, setAdminUsername] = useState("");

  // Check login status on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const username = localStorage.getItem("adminUsername") || "";
    setIsLoggedIn(loggedIn);
    setAdminUsername(username);
  }, []);

  const handleLoginSuccess = () => {
    const username = localStorage.getItem("adminUsername") || "";
    setIsLoggedIn(true);
    setAdminUsername(username);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminUsername");
      setIsLoggedIn(false);
      setAdminUsername("");
      setActiveTab("dashboard");
    }
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "services":
        return <ServicesManagement />;
      case "prices":
        return <PricesManagement />;
      case "testimonials":
        return <TestimonialsManagement />;
      case "contacts":
        return <ContactsManagement />;
      case "gallery":
        return <GalleryManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-4">
              <h2 className="mb-0">
                <i className="fa fa-dashboard"></i> Admin Dashboard
              </h2>
            </div>
            <div className="col-md-4 text-center">
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                <i className="fa fa-user"></i> Xin chào,{" "}
                <strong>{adminUsername}</strong>
              </span>
            </div>
            <div className="col-md-4 text-right">
              <Link to="/" className="btn btn-outline-light mr-2">
                <i className="fa fa-home"></i> Trang Chủ
              </Link>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i> Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fa fa-dashboard"></i>
              <span>Dashboard</span>
            </button>

            <button
              className={`admin-nav-item ${
                activeTab === "services" ? "active" : ""
              }`}
              onClick={() => setActiveTab("services")}
            >
              <i className="fa fa-scissors"></i>
              <span>Dịch Vụ</span>
            </button>

            <button
              className={`admin-nav-item ${
                activeTab === "prices" ? "active" : ""
              }`}
              onClick={() => setActiveTab("prices")}
            >
              <i className="fa fa-dollar"></i>
              <span>Bảng Giá</span>
            </button>

            <button
              className={`admin-nav-item ${
                activeTab === "testimonials" ? "active" : ""
              }`}
              onClick={() => setActiveTab("testimonials")}
            >
              <i className="fa fa-star"></i>
              <span>Đánh Giá</span>
            </button>

            <button
              className={`admin-nav-item ${
                activeTab === "contacts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              <i className="fa fa-envelope"></i>
              <span>Tin Nhắn</span>
            </button>

            <button
              className={`admin-nav-item ${
                activeTab === "gallery" ? "active" : ""
              }`}
              onClick={() => setActiveTab("gallery")}
            >
              <i className="fa fa-images"></i>
              <span>Gallery</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Admin;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GalleryController from "../controllers/GalleryController";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Danh sách các danh mục
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "toc", name: "Tóc" },
    { id: "uon", name: "Uốn" },
    { id: "nhuom", name: "Nhuộm" },
    { id: "other", name: "Khác" },
  ];

  // Load galleries từ API
  useEffect(() => {
    loadGalleries();
  }, [activeCategory]);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const categoryParam = activeCategory === "all" ? null : activeCategory;
      const data = await GalleryController.getAllGalleries(categoryParam);
      setGalleries(data || []);
    } catch (error) {
      console.error("Error loading galleries:", error);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy ảnh theo danh mục được chọn
  const getImagesByCategory = () => {
    if (activeCategory === "all") {
      return galleries;
    }
    return galleries.filter((img) => img.category === activeCategory);
  };

  return (
    <div>
      <section class="inner-page-banner" id="home"></section>

      <div class="breadcrumb-agile">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Thư viện ảnh
          </li>
        </ol>
      </div>
      <section class="gallery py-5" id="gallery">
        <div class="container py-md-5">
          <h3 class="heading text-center mb-3 mb-sm-5">
            Thư viện ảnh của chúng tôi
          </h3>

          {/* Category Filter Buttons */}
          <div class="text-center mb-4">
            <div
              class="gallery-categories"
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "30px",
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    background:
                      activeCategory === category.id ? "#ffc905" : "#f0f0f0",
                    color: activeCategory === category.id ? "#000" : "#323648",
                    border:
                      "2px solid " +
                      (activeCategory === category.id ? "#ffc905" : "#e0e0e0"),
                    padding: "10px 25px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== category.id) {
                      e.target.style.background = "#e0e0e0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== category.id) {
                      e.target.style.background = "#f0f0f0";
                    }
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div class="gallery-content">
            {loading ? (
              <div class="text-center py-5">
                <p>Đang tải ảnh...</p>
              </div>
            ) : getImagesByCategory().length === 0 ? (
              <div class="text-center py-5">
                <p>Chưa có ảnh nào trong danh mục này.</p>
              </div>
            ) : (
              <>
                <div class="row" style={{ margin: "0 -15px" }}>
                  {getImagesByCategory().map((image, index) => {
                    return (
                      <div
                        key={`${image._id || image.id}-${index}`}
                        class="col-lg-4 col-md-4 col-sm-6 col-12 gal-img"
                        style={{
                          padding: "0 15px",
                          marginBottom: "30px",
                        }}
                      >
                        <div
                          className="gallery-image-container"
                          style={{
                            width: "100%",
                            aspectRatio: "3/4",
                            minHeight: "400px",
                            maxHeight: "500px",
                            overflow: "hidden",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "default",
                            position: "relative",
                            backgroundColor: "#f5f5f5",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-8px) scale(1.02)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 20px rgba(0,0,0,0.2)";
                            const overlay =
                              e.currentTarget.querySelector(".image-overlay");
                            if (overlay) overlay.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                            const overlay =
                              e.currentTarget.querySelector(".image-overlay");
                            if (overlay) overlay.style.opacity = "0";
                          }}
                        >
                          <img
                            src={image.image}
                            alt={image.alt || "Gallery image"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              display: "block",
                            }}
                            loading="lazy"
                          />
                          {image.alt && (
                            <div
                              className="image-overlay"
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                padding: "15px",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                pointerEvents: "none",
                              }}
                            >
                              <div
                                style={{
                                  color: "#fff",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                                }}
                              >
                                {image.alt}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

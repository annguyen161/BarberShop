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
                <div class="row">
                  {getImagesByCategory().map((image, index) => {
                    const popupId = `gal-${
                      image._id || image.id
                    }-${activeCategory}`;
                    return (
                      <div
                        key={`${image._id || image.id}-${index}`}
                        class="col-md-4 col-sm-6 gal-img"
                      >
                        <a href={`#${popupId}`}>
                          <img
                            src={image.image}
                            alt={image.alt || "Gallery image"}
                            class="img-fluid mt-4"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Popup Effects */}
                {getImagesByCategory().map((image, index) => {
                  const popupId = `gal-${
                    image._id || image.id
                  }-${activeCategory}`;
                  return (
                    <div
                      key={`popup-${image._id || image.id}-${index}`}
                      id={popupId}
                      class="popup-effect"
                    >
                      <div class="popup">
                        <img
                          src={image.image}
                          alt={image.alt || "Popup image"}
                          class="img-fluid mt-4"
                        />
                        <a class="close" href="#gallery">
                          &times;
                        </a>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

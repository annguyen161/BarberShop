import React, { useState, useEffect } from "react";
import api, { API_ENDPOINTS } from "../config/api";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.TESTIMONIALS);

      if (response.success) {
        // Lấy 3 bài đánh giá mới nhất
        const latestTestimonials = response.data.slice(0, 3);
        setTestimonials(latestTestimonials);
      } else {
        setError("Không thể tải dữ liệu đánh giá");
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Lỗi khi tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <h4 className="alert-heading">Lỗi!</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={fetchTestimonials}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <section className="testimonials py-5" id="testimonials">
      <div className="container py-md-5">
        <h3 className="heading text-center mb-3 mb-sm-5">
          Đánh giá của khách hàng
        </h3>
        <div className="row mt-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className="col-md-4 test-grid text-left px-lg-3 mb-4"
            >
              <div className="test-info h-100 d-flex flex-column">
                <p className="flex-grow-1 mb-3">{testimonial.comment}</p>
                <div className="mt-auto">
                  <h3
                    className="mb-3"
                    style={{
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {testimonial.name}
                  </h3>
                  <div className="text-center">
                    <img
                      src={testimonial.image}
                      className="img-fluid"
                      alt="user-image"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsList;

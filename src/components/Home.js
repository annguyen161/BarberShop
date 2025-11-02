import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PriceList from "./PriceList";
import TestimonialsList from "./TestimonialsList";
import ServiceController from "../controllers/ServiceController";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await ServiceController.getAllServices();
      // Xử lý cả 2 trường hợp: response.data hoặc response trực tiếp là array
      const servicesData = response?.data || response || [];
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error("Error loading services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy 2 service đầu tiên cho hàng lớn
  const firstTwoServices = services.slice(0, 2);
  // Lấy 4 service tiếp theo cho hàng nhỏ
  const nextFourServices = services.slice(2, 6);

  return (
    <div>
      //{" "}
      {/* <!-- //header -->
// <!-- banner --> */}
      <div class="banner_w3lspvt" id="home">
        <div class="csslider infinity" id="slider1">
          <input type="radio" name="slides" checked="checked" id="slides_1" />
          <input type="radio" name="slides" id="slides_2" />
          <input type="radio" name="slides" id="slides_3" />
          <input type="radio" name="slides" id="slides_4" />

          <ul class="banner_slide_bg">
            <li>
              <div class="slider-info bg1">
                <div class="bs-slider-overlay">
                  <div class="banner-text">
                    <div class="container">
                      <h2 class="movetxt agile-title text-capitalize">
                        Chúng Tôi Tạo Ra Và Cải Tiến Xu Hướng Tóc
                      </h2>
                      <p>
                        Chúng tôi chuyên tạo ra những kiểu tóc mới nhất và cải
                        tiến các xu hướng tóc hiện đại. Với kinh nghiệm nhiều
                        năm trong ngành.
                      </p>

                      <Link to="tel:+84395284436" class="btn">
                        Liên hệ ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="slider-info bg2">
                <div class="bs-slider-overlay1">
                  <div class="banner-text">
                    <div class="container">
                      <h4 class="movetxt agile-title text-capitalize">
                        Chúng Tôi Giúp Tóc Và Râu Phát Triển Tốt
                      </h4>
                      <p>
                        Chúng tôi cung cấp các dịch vụ chăm sóc tóc và râu
                        chuyên nghiệp, giúp tóc và râu của bạn phát triển khỏe
                        mạnh và đẹp.
                      </p>
                      <Link to="tel:+84395284436" class="btn">
                        Liên hệ ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="slider-info bg3">
                <div class="bs-slider-overlay1">
                  <div class="banner-text">
                    <div class="container">
                      <h2 class="movetxt agile-title text-capitalize">
                        Chúng Tôi Thiết Kế Và Tạo Kiểu Tóc Mới Nhất
                      </h2>
                      <p>
                        Chúng tôi luôn cập nhật và tạo ra những kiểu tóc mới
                        nhất theo xu hướng thời trang hiện đại.
                      </p>
                      <Link to="tel:+84395284436" class="btn">
                        Liên hệ ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="slider-info bg4">
                <div class="bs-slider-overlay1">
                  <div class="banner-text">
                    <div class="container">
                      <h4 class="movetxt agile-title text-capitalize">
                        Chúng Tôi Thiết Kế Kiểu Tóc Xu Hướng Mới Nhất
                      </h4>
                      <p>
                        Chúng tôi chuyên thiết kế những kiểu tóc theo xu hướng
                        mới nhất, mang đến cho bạn vẻ ngoài hiện đại và thời
                        trang.
                      </p>
                      <Link to="tel:+84395284436" class="btn">
                        Liên hệ ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="navigation">
            <div>
              <label for="slides_1"></label>
              <label for="slides_2"></label>
              <label for="slides_3"></label>
              <label for="slides_4"></label>
            </div>
          </div>
        </div>
      </div>
      //{" "}
      {/* <!-- //banner -->
//  <!-- banner bottom grids --> */}
      <section class="content-info py-5" id="about">
        <div class="container py-md-5">
          <h3 class="heading text-center mb-3 mb-sm-5">Về chúng tôi</h3>

          <div class="info-w3pvt-mid text-center px-lg-5">
            <div class="title-desc text-center px-lg-5">
              <img
                src="assets/images/about1.png"
                alt="news image"
                class="img-fluid"
              />
              <p class="px-lg-5">
                Chúng tôi là salon tóc chuyên nghiệp với nhiều năm kinh nghiệm
                trong ngành. Chúng tôi cam kết mang đến cho khách hàng những
                dịch vụ chăm sóc tóc chất lượng cao nhất. Với đội ngũ thợ cắt
                tóc chuyên nghiệp và trang thiết bị hiện đại, chúng tôi tự tin
                mang đến cho bạn những trải nghiệm tuyệt vời nhất.
              </p>

              <Link
                to="/services"
                class="btn mt-lg-4 mt-3 read scroll"
                role="button"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>
      //{" "}
      {/* <!-- //banner bottom grids -->

//  <!-- /services --> */}
      <section class="services py-5" id="services">
        <div class="container py-md-5">
          <h3 class="heading text-center mb-3 mb-sm-5">Dịch vụ</h3>
          {loading ? (
            <div class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <p class="mt-3">Đang tải dịch vụ...</p>
            </div>
          ) : services.length === 0 ? (
            <div class="text-center py-5">
              <p>Chưa có dịch vụ nào</p>
            </div>
          ) : (
            <>
              {/* Hàng lớn - 2 dịch vụ đầu tiên */}
              {firstTwoServices.length > 0 && (
                <div class="row ab-info">
                  {firstTwoServices.map((service) => (
                    <div
                      key={service._id}
                      class="col-md-6 ab-content ab-content1"
                      style={{
                        display: "flex",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        class="ab-content-inner"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1em",
                            overflow: "hidden",
                            height: "250px",
                          }}
                        >
                          <img
                            src={service.image || "assets/images/services2.jpg"}
                            alt={service.name}
                            class="img-fluid"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src = "assets/images/services2.jpg";
                            }}
                          />
                        </div>
                        <div
                          class="ab-info-con"
                          style={{
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <h4 style={{ margin: "0.5em 0" }}>{service.name}</h4>
                          <div
                            class="read-more two btn m-0 px-3"
                            style={{ alignSelf: "center", cursor: "default" }}
                          >
                            <span class="fa fa-arrow-circle-o-right"> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hàng nhỏ - 4 dịch vụ tiếp theo */}
              {nextFourServices.length > 0 && (
                <div class="row ab-info second mt-lg-4">
                  {nextFourServices.map((service) => (
                    <div
                      key={service._id}
                      class="col-md-3 ab-content"
                      style={{
                        display: "flex",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        class="ab-content-inner"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1em",
                            overflow: "hidden",
                            height: "200px",
                          }}
                        >
                          <img
                            src={service.image || "assets/images/ser3.jpg"}
                            alt={service.name}
                            class="img-fluid"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src = "assets/images/ser3.jpg";
                            }}
                          />
                        </div>
                        <div
                          class="ab-info-con"
                          style={{
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <h4 style={{ margin: "0.5em 0" }}>{service.name}</h4>
                          <div
                            class="read-more two btn m-0 px-3"
                            style={{ alignSelf: "center", cursor: "default" }}
                          >
                            <span class="fa fa-arrow-circle-o-right"> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {/* // <!-- /services -->
 
	// <!-- pricing -->  */}
      <PriceList />
      //{" "}
      {/* <!-- //pricing -->
//   <!--/order-now--> */}
      <section class="order-sec py-5">
        <div class="container py-md-5">
          <div class="test-info text-center">
            <h3 class="tittle order">
              <span>GỌI CHÚNG TÔI ĐỂ ĐẶT LỊCH HẸN</span>Đội ngũ của chúng tôi sẽ
              gọi lại ngay lập tức và đặt lịch hẹn
            </h3>
            <h4 class="tittle my-2">+84 395 284 436 </h4>

            <div class="read-more mx-auto m-0 text-center">
              <Link to="tel:+84395284436" class="read-more scroll btn">
                Nhấn vào đây
              </Link>
            </div>
          </div>
        </div>
      </section>
      //{" "}
      {/* <!--//order-now-->

//  <!--/testimonials--> */}
      <TestimonialsList />
      //{" "}
      {/* <!--//testimonials-->
// <!-- subscribe --> */}
      <section class="subscribe" id="subscribe">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-5 d-flex subscribe-left p-lg-5 py-sm-5 py-4">
              <div class="news-icon mr-3">
                <span class="fa fa-paper-plane" aria-hidden="true"></span>
              </div>
              <div class="text">
                <h3>Đăng ký nhận bản tin của chúng tôi</h3>
              </div>
            </div>
            <div class="col-md-7 subscribe-right p-lg-5 py-sm-5 py-4">
              <form action="#" method="post">
                <input
                  type="email"
                  name="phone"
                  placeholder="Nhập số điện thoại của bạn tại đây"
                  required=""
                />
                <button
                  class="btn1"
                  type="button"
                  onClick={(e) => e.preventDefault()}
                >
                  <span class="fa fa-paper-plane"></span>
                </button>
              </form>
              <p>
                chúng tôi không bao giờ chia sẻ email của bạn với bất kỳ ai khác
              </p>
            </div>
          </div>
        </div>
      </section>
      //{" "}
      {/* <!-- //subscribe -->
// <!-- footer --> */}
    </div>
  );
};

export default Home;

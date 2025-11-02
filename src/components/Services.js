import React from "react";

const Services = () => {
  return (
    <div>
      <section class="inner-page-banner" id="home"></section>

      <div class="breadcrumb-agile">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="index.html">Trang chủ</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Dịch vụ
          </li>
        </ol>
      </div>

      <section class="what-we-do py-5">
        <div class="container py-md-5">
          <h3 class="heading text-center mb-3 mb-sm-5">
            Kiểu tóc của chúng tôi
          </h3>
          <div class="row what-we-do-grid">
            <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0">
              <img src="assets/images/sp1.jpg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-3 col-md-6 bg-grid-clr">
              <h4 class="mt-md-0 my-2">CẮT TÓC</h4>
              <p class="">
                Chúng tôi cung cấp các dịch vụ cắt tóc chuyên nghiệp với nhiều
                kiểu tóc khác nhau.
              </p>
            </div>
            <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-0 mt-4">
              <img src="assets/images/sp2.jpg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-0 mt-md-4">
              <h4 class="mt-md-0 my-2">CẠO RÂU</h4>
              <p class="">
                Dịch vụ cạo râu chuyên nghiệp với các sản phẩm chất lượng cao.
              </p>
            </div>

            <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-5 mt-4">
              <img src="assets/images/sp3.jpg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-5 mt-md-4">
              <h4 class="mt-md-0 my-2">Nhuộm tóc</h4>
              <p class="">
                Dịch vụ nhuộm tóc chuyên nghiệp để tạo ra kiểu tóc hoàn hảo.
              </p>
            </div>
            <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-5 mt-4">
              <img src="assets/images/sp4.jpg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-5 mt-md-4">
              <h4 class="mt-md-0 my-2">Uốn tóc</h4>
              <p class="">
                Dịch vụ uốn tóc chuyên nghiệp để tạo ra kiểu tóc hoàn hảo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

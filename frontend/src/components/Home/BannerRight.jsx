import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import banner from "../../assets/banner.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";

import { Autoplay, Pagination } from "swiper/modules";

export default function BannerRight() {
  return (
    <Swiper
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      loop={true}
      className="mySwiper"
    >
      <SwiperSlide>
        <img src={banner} alt="Banner 1" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={banner2} alt="Banner 2" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={banner3} alt="Banner 3" />
      </SwiperSlide>
    </Swiper>
  );
}

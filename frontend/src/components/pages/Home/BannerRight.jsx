
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

import axios from "axios";

export default function BannerRight() {
  const [banners, setBanners] = useState([]);

  const API_URL = (
    import.meta.env.VITE_DJANGO_BASE_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  const getImageUrl = (value) => {
    if (!value) return null;

    const stringValue = String(value);

    if (
      stringValue.startsWith("http://") ||
      stringValue.startsWith("https://") ||
      stringValue.startsWith("blob:")
    ) {
      return stringValue;
    }

    if (stringValue.startsWith("/")) {
      return `${API_URL}${stringValue}`;
    }

    return `${API_URL}/${stringValue}`;
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings/`);

        const data = response.data;

        const bannerList = [
          data.banner_1,
          data.banner_2,
          data.banner_3,
        ]
          .filter(Boolean)
          .map(getImageUrl);

        setBanners(bannerList);
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    };

    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <Swiper
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        loop={banners.length > 1}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="w-full">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="
                  block
                  w-full
                  h-auto
                  min-h-[160px]
                  sm:min-h-[200px]
                  md:min-h-[250px]
                  lg:min-h-[300px]
                  xl:min-h-[350px]
                  object-cover
                  rounded-lg
                "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}





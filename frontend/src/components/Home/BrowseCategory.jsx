import React from "react";
import {
  FaMobileAlt,
  FaDesktop,
  FaCamera,
  FaHeadphones,
  FaGamepad,
  FaTv,
  FaShoePrints,
} from "react-icons/fa";
import { FiWatch } from "react-icons/fi";
import { FaLaptop } from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const BrowseCategory = () => {
  const categories = [
    {
      name: "Phones",
      icon: <FaMobileAlt />,
    },
    {
      name: "Computers",
      icon: <FaDesktop />,
    },
    {
      name: "SmartWatch",
      icon: <FiWatch />,
    },
    {
      name: "Camera",
      icon: <FaCamera />,
    },
    {
      name: "HeadPhones",
      icon: <FaHeadphones />,
    },
    {
      name: "Gaming",
      icon: <FaGamepad />,
    },
    {
      name: "TV",
      icon: <FaTv />,
    },
    {
      name: "Fashion",
      icon: <FaShoePrints />,
    },
    {
      name: "Laptop",
      icon: <FaLaptop />,
    },
  ];

  return (
    <section className="w-full py-8 sm:py-10 md:py-16">
      <div className=" mx-auto ">

        {/* ================= HEADER ================= */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">

          <div>
            {/* Red Label */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-5 h-9 sm:h-10 bg-[#DB4444] rounded-sm"></div>

              <span className="text-[#DB4444] text-sm sm:text-base font-medium">
                Categories
              </span>
            </div>

            {/* Title */}
            <h2
              className="
                text-2xl
                sm:text-3xl
                md:text-[30px]
                font-semibold
                tracking-wide
              "
            >
              Browse By Category
            </h2>
          </div>

          {/* ================= ARROWS ================= */}
          {/* <div className="flex items-center gap-2">

            <button
              type="button"
              className="
                category-prev
                w-9
                h-9
                sm:w-10
                sm:h-10
                rounded-full
                bg-[#F5F5F5]
                flex
                items-center
                justify-center
                hover:bg-gray-200
                transition
              "
            >
              
            </button>

            <button
              type="button"
              className="
                category-next
                w-9
                h-9
                sm:w-10
                sm:h-10
                rounded-full
                bg-[#F5F5F5]
                flex
                items-center
                justify-center
                hover:bg-gray-200
                transition
              "
            >

            </button>

          </div> */}
        </div>

        {/* ================= CATEGORY SLIDER ================= */}
        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          navigation={{
            prevEl: ".category-prev",
            nextEl: ".category-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },

            768: {
              slidesPerView: 4,
              spaceBetween: 18,
            },

            1024: {
              slidesPerView: 7,
              spaceBetween: 20,
            },
          }}
          className="categorySwiper"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>

              <div
                className="
                  group
                  relative
                  h-[110px]
                  sm:h-[120px]
                  md:h-[130px]
                  border
                  border-gray-300
                  rounded-sm
                  cursor-pointer
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-white
                  overflow-hidden
                  transition-all
                  duration-300
                  hover:bg-[#DB4444]
                  hover:border-[#DB4444]
                "
              >
                {/* Black Hover Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black
                    opacity-0
                    group-hover:opacity-20
                    transition-opacity
                    duration-300
                  "
                ></div>

                {/* Icon */}
                <div
                  className="
                    relative
                    z-10
                    text-3xl
                    sm:text-4xl
                    text-black
                    group-hover:text-black
                    transition-colors
                    duration-300
                  "
                >
                  {category.icon}
                </div>

                {/* Name */}
                <span
                  className="
                    relative
                    z-10
                    text-xs
                    sm:text-sm
                    font-medium
                    text-black
                    group-hover:text-white
                    transition-colors
                    duration-300
                  "
                >
                  {category.name}
                </span>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default BrowseCategory;
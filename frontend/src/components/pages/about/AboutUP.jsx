import React from "react";
import {
  FaStore,
  FaDollarSign,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import aboutImage from "../../../assets/aboutSideImage.png";

const About = () => {
  const statistics = [
    {
      icon: FaStore,
      value: "10.5k",
      text: "Sellers active our site",
    },
    {
      icon: FaDollarSign,
      value: "33k",
      text: "Monthly Product Sale",
    },
    {
      icon: FaShoppingBag,
      value: "45.5k",
      text: "Customer active in our site",
    },
    {
      icon: FaMoneyBillWave,
      value: "25k",
      text: "Annual gross sale in our site",
    },
  ];

  return (
    <section className="min-h-screen bg-white py-8 sm:py-12 lg:py-24">
      {/* Main Container */}
      <div className="mx-auto w-[92%] w-full sm:w-[90%]">

        {/* ================= OUR STORY ================= */}
        <div className="grid grid-cols-1 items-center gap-7 sm:gap-9 lg:grid-cols-2 lg:gap-12">

          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="mb-3 text-[20px] font-semibold tracking-wide text-black sm:mb-5 sm:text-3xl lg:text-4xl">
              Our Story
            </h1>

            <p className="mb-4 max-w-[500px] text-[12px] leading-[1.7] text-gray-800 sm:mb-6 sm:text-[15px] lg:text-[16px]">
              Launched in 2015, Exclusive is South Asia's premier online
              shopping marketplace with an active presence in Bangladesh.
              Supported by wide range of tailored marketing, data and service
              solutions, Exclusive has 10,500 sellers and 300 brands and serves
              3 millions customers across the region.
            </p>

            <p className="max-w-[500px] text-[12px] leading-[1.7] text-gray-800 sm:text-[15px] lg:text-[16px]">
              Exclusive has more than 1 Million products to offer, growing at a
              very fast. Exclusive offers a diverse assortment in categories
              ranging from consumer.
            </p>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <img
              src={aboutImage}
              alt="Our Story"
              className="
                h-auto
                max-h-[300px]
                w-full
                object-cover
                sm:max-h-[360px]
                lg:h-[380px]
                lg:max-h-none
              "
            />
          </div>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="relative mt-10 sm:mt-12 lg:mt-16">

          {/* Previous Button */}
          <button
            type="button"
            className="
              about-prev
              absolute
              left-0
              top-1/2
              z-20
              flex
              h-8
              w-8
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-300
              bg-white
              text-black
              shadow-sm
              transition-all
              duration-300
              hover:border-[#DB4144]
              hover:bg-[#DB4144]
              hover:text-white
              sm:h-9
              sm:w-9
            "
            aria-label="Previous"
          >
            ←
          </button>

          {/* Next Button */}
          <button
            type="button"
            className="
              about-next
              absolute
              right-0
              top-1/2
              z-20
              flex
              h-8
              w-8
              translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-300
              bg-white
              text-black
              shadow-sm
              transition-all
              duration-300
              hover:border-[#DB4144]
              hover:bg-[#DB4144]
              hover:text-white
              sm:h-9
              sm:w-9
            "
            aria-label="Next"
          >
            →
          </button>

          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation={{
              prevEl: ".about-prev",
              nextEl: ".about-next",
            }}
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 14,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
            }}
            className="w-full"
          >
            {statistics.map((item, index) => {
              const Icon = item.icon;

              return (
                <SwiperSlide key={index}>
                  <div
                    className="
                      group
                      flex
                      min-h-[108px]
                      w-full
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-4
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#DB4144]
                      hover:bg-[#DB4144]
                      hover:shadow-md
                      sm:min-h-[115px]
                    "
                  >
                    {/* Outer Circle */}
                    <div
                      className="
                        mb-2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-300
                        transition-all
                        duration-300
                        group-hover:bg-white/50
                      "
                    >
                      {/* Inner Circle */}
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          text-white
                          transition-all
                          duration-300
                          group-hover:bg-white
                          group-hover:text-black
                        "
                      >
                        <Icon className="text-xs" />
                      </div>
                    </div>

                    {/* Value */}
                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-black
                        transition-colors
                        duration-300
                        group-hover:text-white
                      "
                    >
                      {item.value}
                    </h3>

                    {/* Description */}
                    <p
                      className="
                        text-center
                        text-[9px]
                        text-gray-700
                        transition-colors
                        duration-300
                        group-hover:text-white
                      "
                    >
                      {item.text}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default About;
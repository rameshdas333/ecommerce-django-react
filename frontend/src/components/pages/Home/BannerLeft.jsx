
import React from "react";
import { Link } from "react-router-dom";

const BannerLeft = () => {
  return (
    <div
      className="
        w-full
        md:w-auto
        py-2
        sm:py-3
        md:py-0
        md:pt-[80px]
        md:pr-10
        relative

        md:after:absolute
        md:after:content-['']
        md:after:top-0
        md:after:right-10
        md:after:bg-[#D9D9D9]
        md:after:w-[2px]
        md:after:h-full
      "
    >
      <Link
        to="/category/womens-fashion"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Woman’s Fashion
      </Link>

      <Link
        to="/category/mens-fashion"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Men’s Fashion
      </Link>

      <Link
        to="/category/electronics"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Electronics
      </Link>

      <Link
        to="/category/home-lifestyle"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Home & Lifestyle
      </Link>

      <Link
        to="/category/medicine"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Medicine
      </Link>

      <Link
        to="/category/sports-outdoor"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Sports & Outdoor
      </Link>

      <Link
        to="/category/babys-toys"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Baby’s & Toys
      </Link>

      <Link
        to="/category/groceries-pets"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Groceries & Pets
      </Link>

      <Link
        to="/category/health-beauty"
        className="block py-2 text-sm sm:text-base md:text-base hover:text-[#DB4444] transition"
      >
        Health & Beauty
      </Link>
    </div>
  );
};

export default BannerLeft;


import React from "react";
import { Link } from "react-router-dom";

const BannerLeft = () => {
  return (
    <div
      className="
        w-full
        md:w-auto
        py-2
        pt-6
        sm:pt-10
        md:pt-[80px]
        relative
        pr-10
        after:absolute
        after:content-['']
        after:top-0
        after:right-10
        after:bg-[#D9D9D9]
        after:w-[2px]
        after:h-full
      "
    >
      <Link
        to="/category/womens-fashion"
        className="block py-2 text-base"
      >
        Woman’s Fashion
      </Link>

      <Link
        to="/category/mens-fashion"
        className="block py-2 text-base"
      >
        Men’s Fashion
      </Link>

      <Link
        to="/category/electronics"
        className="block py-2 text-base"
      >
        Electronics
      </Link>

      <Link
        to="/category/home-lifestyle"
        className="block py-2 text-base"
      >
        Home & Lifestyle
      </Link>

      <Link
        to="/category/medicine"
        className="block py-2 text-base"
      >
        Medicine
      </Link>

      <Link
        to="/category/sports-outdoor"
        className="block py-2 text-base"
      >
        Sports & Outdoor
      </Link>

      <Link
        to="/category/babys-toys"
        className="block py-2 text-base"
      >
        Baby’s & Toys
      </Link>

      <Link
        to="/category/groceries-pets"
        className="block py-2 text-base"
      >
        Groceries & Pets
      </Link>

      <Link
        to="/category/health-beauty"
        className="block py-2 text-base"
      >
        Health & Beauty
      </Link>
    </div>
  );
};

export default BannerLeft;
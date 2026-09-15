import React, { useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Air Jordan 3",
    sold: "752 Pcs",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Air Jordan 8",
    sold: "752 Pcs",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Air Jordan 5",
    sold: "752 Pcs",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Air Jordan 13",
    sold: "752 Pcs",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Nike Air Max",
    sold: "752 Pcs",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Nike Air Force",
    sold: "698 Pcs",
    image:
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    name: "Nike Dunk Low",
    sold: "645 Pcs",
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    name: "Adidas Superstar",
    sold: "590 Pcs",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&q=80",
  },
];

const TopSellingProducts = () => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 180;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 180;
    }
  };

  return (
    <div className="w-full min-w-0 bg-white border border-[#eeeeee] rounded-[4px] p-3 sm:p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#333]">
          Top Selling Products
        </h2>

        {/* Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={scrollLeft}
            className="w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#55c99a] transition"
          >
            <FiArrowLeft size={15} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#55c99a] transition"
          >
            <FiArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Products */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              shrink-0
              w-[125px]
              sm:w-[135px]
              md:w-[145px]
              bg-[#fafafa]
              border
              border-[#f0f0f0]
              rounded-[3px]
              p-2
            "
          >
            {/* Image */}
            <div className="w-full h-[85px] sm:h-[95px] bg-white rounded-[2px] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product name */}
            <h3 className="text-[10px] sm:text-[11px] font-semibold text-[#333] truncate mt-2">
              {product.name}
            </h3>

            {/* Sold */}
            <p className="text-[9px] sm:text-[10px] text-[#999] mt-1">
              {product.sold}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
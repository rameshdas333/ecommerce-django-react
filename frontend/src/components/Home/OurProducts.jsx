
import { GoHeart } from "react-icons/go";
import Title from "../Title/Title";
import { IoEyeOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import cat from "../../assets/cat.png";
import camera from "../../assets/camera.png";
import laptop from "../../assets/laptop.png";
import facewash from "../../assets/facewash.png";
import fan from "../../assets/fann.jpg";
import shirt from "../../assets/Shirt.png";
import { useState } from "react";

const OurProducts = () => {
  const [visible, setVisible] = useState(4);

  const handleLoadData = () => {
    setVisible((prev) => prev + 4);
  };

  const products = [
    {
      name: "Breed Dry Dog Food",
      price: "BDT 400",
      image: cat,
      rating: 5,
    },
    {
      name: "CANON EOS DSLR Camera",
      price: "BDT 30000",
      image: camera,
      rating: 4,
    },
    {
      name: "ASUS FHD Gaming Laptop",
      price: "BDT 64000",
      image: laptop,
      rating: 5,
    },
    {
      name: "Curology Product Set",
      price: "BDT 600",
      image: facewash,
      rating: 4,
    },
    {
      name: " Fan High Speed",
      price: "BDT 900",
      image: fan,
      rating: 5,
    },
    {
      name: "Shart",
      price: "BDT 700",
      image: shirt,
      rating: 4,
    },
    {
      name: "Breed Dry Dog Food",
      price: "BDT 400",
      image: cat,
      rating: 5,
    },
    {
      name: "CANON EOS DSLR Camera",
      price: "BDT 30000",
      image: camera,
      rating: 4,
    },
    {
      name: "ASUS FHD Gaming Laptop",
      price: "BDT 64000",
      image: laptop,
      rating: 5,
    },
    {
      name: "Curology Product Set",
      price: "BDT 600",
      image: facewash,
      rating: 4,
    },
  ];

  return (
    <section className="w-full ">
      <div className="w-full mx-auto">

        {/* Title */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Title
            name="This Month"
            title="Best Selling Products"
            titleSize="text-[22px] sm:text-[26px] md:text-[30px]"
          />
        </div>

        {/* Products */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-x-3
            gap-y-7
            sm:gap-x-5
            sm:gap-y-8
            md:gap-x-6
            md:gap-y-10
          "
        >
          {products.slice(0, visible).map((product, idx) => (
            <div key={idx} className="w-full min-w-0">

              {/* Image Box */}
              <div
                className="
                  bg-[#F5F5F5]
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  w-full
                  h-[170px]
                  sm:h-[200px]
                  md:h-[220px]
                  lg:h-[250px]
                  overflow-hidden
                  rounded-sm
                "
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    max-w-[80%]
                    max-h-[80%]
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* Heart + Eye */}
                <div
                  className="
                    absolute
                    top-2
                    right-2
                    sm:top-3
                    sm:right-3
                    flex
                    flex-col
                    gap-2
                  "
                >
                  <button
                    type="button"
                    className="
                      flex
                      items-center
                      justify-center
                      w-8
                      h-8
                      sm:w-[34px]
                      sm:h-[34px]
                      bg-white
                      rounded-full
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <GoHeart className="text-base sm:text-lg" />
                  </button>

                  <button
                    type="button"
                    className="
                      flex
                      items-center
                      justify-center
                      w-8
                      h-8
                      sm:w-[34px]
                      sm:h-[34px]
                      bg-white
                      rounded-full
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <IoEyeOutline className="text-base sm:text-lg" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  type="button"
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    py-2
                    text-xs
                    sm:text-sm
                    bg-black
                    text-white
                    opacity-0
                    group-hover:opacity-100
                    transition
                    duration-300
                  "
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Name */}
              <p
                className="
                  pt-3
                  sm:pt-4
                  pb-1.5
                  sm:pb-2
                  font-primary
                  font-medium
                  text-sm
                  sm:text-base
                  truncate
                "
              >
                {product.name}
              </p>

              {/* Price + Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p
                  className="
                    font-primary
                    font-medium
                    text-sm
                    sm:text-base
                    text-primary1
                  "
                >
                  {product.price}
                </p>

                {/* Rating */}
                <div className="flex items-center">
                  {[...Array(5)].map((_, starIdx) => (
                    <TiStarFullOutline
                      key={starIdx}
                      className={`
                        text-base
                        sm:text-lg
                        md:text-xl
                        ${
                          starIdx < product.rating
                            ? "text-[#FFAD33]"
                            : "text-gray-300"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {visible < products.length && (
          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            <button
              onClick={handleLoadData}
              type="button"
              className="
                w-full
                max-w-[180px]
                sm:max-w-[200px]
                px-4
                sm:px-6
                py-2.5
                sm:py-3
                bg-[#DB4444]
                text-white
                text-sm
                sm:text-base
                rounded
                hover:bg-[#c73535]
                transition
                duration-300
              "
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurProducts;


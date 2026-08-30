import Title from "../Title/Title.jsx";

import bag from "../../assets/bag.png";
import music from "../../assets/music.png";
import bookself from "../../assets/bookself.png";
import shart from "../../assets/Shirt.png";

import { GoHeart } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";

const BestSellingProduct = () => {
  return (
    <section className="">
      <div
        className="
          relative
          pt-8
          sm:pt-10
          md:pt-12
          pb-12
          sm:pb-16
          md:pb-20
          lg:pb-[122px]

          after:absolute
          after:content-['']
          after:bg-[#D9D9D9]
          after:h-[1px]
          after:w-full
          after:top-0
          after:left-0
        "
      >
        {/* ================= TITLE ================= */}

        <div className="mb-8 sm:mb-10 md:mb-12">
          <div
            className="
              [&_h1]:text-2xl
              [&_h1]:leading-tight

              sm:[&_h1]:text-3xl
              md:[&_h1]:text-4xl
              lg:[&_h1]:text-5xl

              [&_p]:text-sm
              sm:[&_p]:text-base
              md:[&_p]:text-lg
            "
          >
            <Title
              name="This Month"
              title="Best Selling Products"
            />
          </div>
        </div>

        {/* ================= PRODUCTS GRID ================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4

            gap-5
            sm:gap-6
            lg:gap-[30px]
          "
        >
          {/* ================= PRODUCT 1 ================= */}

          <div className="w-full min-w-0">
            <div
              className="
                bg-[#F5F5F5]
                relative
                flex
                items-center
                justify-center
                w-full
                h-[250px]
              "
            >
              <img
                src={shart}
                alt="The north coat"
                className="
                  max-w-[80%]
                  max-h-[80%]
                  object-contain
                "
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  className="
                    flex
                    items-center
                    justify-center
                    h-[34px]
                    w-[34px]
                    bg-white
                    rounded-full
                  "
                >
                  <GoHeart />
                </button>

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    justify-center
                    h-[34px]
                    w-[34px]
                    bg-white
                    rounded-full
                  "
                >
                  <IoEyeOutline />
                </button>
              </div>
            </div>

            <p className="pt-4 pb-2 font-primary font-medium text-base">
              The north coat
            </p>

            <div className="flex items-center">
              <p className="font-primary font-medium text-base text-primary1">
                $260
              </p>

              <del className="font-primary font-medium text-base ml-2">
                $360
              </del>
            </div>

            <div className="pt-2 flex items-center">
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />

              <p className="ml-2 font-primary font-medium text-base">
                (65)
              </p>
            </div>
          </div>

          {/* ================= PRODUCT 2 ================= */}

          <div className="w-full min-w-0">
            <div
              className="
                bg-[#F5F5F5]
                relative
                flex
                items-center
                justify-center
                w-full
                h-[250px]
              "
            >
              <img
                src={bag}
                alt="Gucci Duffle Bag"
                className="
                  max-w-[80%]
                  max-h-[80%]
                  object-contain
                "
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <GoHeart />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <IoEyeOutline />
                </button>
              </div>
            </div>

            <p className="pt-4 pb-2 font-primary font-medium text-base">
              Gucci Duffle Bag
            </p>

            <div className="flex items-center">
              <p className="font-primary font-medium text-base text-primary1">
                $960
              </p>

              <del className="font-primary font-medium text-base ml-2">
                $1160
              </del>
            </div>

            <div className="pt-2 flex items-center">
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />

              <p className="ml-2 font-primary font-medium text-base">
                (65)
              </p>
            </div>
          </div>

          {/* ================= PRODUCT 3 ================= */}

          <div className="w-full min-w-0">
            <div
              className="
                bg-[#F5F5F5]
                relative
                flex
                items-center
                justify-center
                w-full
                h-[250px]
              "
            >
              <img
                src={music}
                alt="RGB Liquid CPU Cooler"
                className="
                  max-w-[80%]
                  max-h-[80%]
                  object-contain
                "
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <GoHeart />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <IoEyeOutline />
                </button>
              </div>
            </div>

            <p className="pt-4 pb-2 font-primary font-medium text-base">
              RGB Liquid CPU Cooler
            </p>

            <div className="flex items-center">
              <p className="font-primary font-medium text-base text-primary1">
                $160
              </p>

              <del className="font-primary font-medium text-base ml-2">
                $170
              </del>
            </div>

            <div className="pt-2 flex items-center">
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />

              <p className="ml-2 font-primary font-medium text-base">
                (65)
              </p>
            </div>
          </div>

          {/* ================= PRODUCT 4 ================= */}

          <div className="w-full min-w-0">
            <div
              className="
                bg-[#F5F5F5]
                relative
                flex
                items-center
                justify-center
                w-full
                h-[250px]
              "
            >
              <img
                src={bookself}
                alt="Small BookShelf"
                className="
                  max-w-[80%]
                  max-h-[80%]
                  object-contain
                "
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <GoHeart />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center h-[34px] w-[34px] bg-white rounded-full"
                >
                  <IoEyeOutline />
                </button>
              </div>
            </div>

            <p className="pt-4 pb-2 font-primary font-medium text-base">
              Small BookShelf
            </p>

            <div className="flex items-center">
              <p className="font-primary font-medium text-base text-primary1">
                $360
              </p>
            </div>

            <div className="pt-2 flex items-center">
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />
              <TiStarFullOutline className="text-[#FFAD33] text-2xl" />

              <p className="ml-2 font-primary font-medium text-base">
                (65)
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BestSellingProduct;
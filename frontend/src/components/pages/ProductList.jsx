import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // ==========================================
  // SEARCH CHANGE HOLE PAGE 1 E JABE
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `${BASEURL}/api/products/?page=${currentPage}`;

        // Search thakle search + pagination
        if (search) {
          url = `${BASEURL}/api/products/?search=${encodeURIComponent(
            search
          )}&page=${currentPage}`;
        }

        console.log("API URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log("Backend Response:", data);

        // ==========================================
        // DRF PAGINATION RESPONSE
        // ==========================================

        setProducts(data.results || []);
        setTotalProducts(data.count || 0);

      } catch (error) {
        console.error("Product fetch error:", error);

        setError(error);
        setProducts([]);
        setTotalProducts(0);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [BASEURL, search, currentPage]);

  // ==========================================
  // PRODUCTS PER PAGE
  // ==========================================

  const productsPerPage = 10;

  // ==========================================
  // TOTAL PAGES
  // ==========================================

  const totalPages = Math.ceil(
    totalProducts / productsPerPage
  );

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    // শুধু page change হবে
    // scroll বা jump হবে না
    setCurrentPage(page);
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  // প্রথমবার product load হওয়ার সময়
  // পুরো loading screen দেখাবে
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">
          Error: {error.message}
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
   <div className="min-h-screen bg-gray-100 px-3 sm:px-5 md:px-8 lg:px-12 py-4">

      {/* ==========================================
          SEARCH RESULT TEXT
      ========================================== */}

      {search && (
        <p className="text-center text-gray-600 mb-4">
          Search results for:{" "}
          <span className="font-semibold text-red-500">
            {search}
          </span>
        </p>
      )}

      {/* ==========================================
          NO PRODUCT
      ========================================== */}

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-semibold text-gray-600">
            No products found.
          </p>
        </div>
      ) : (
        <>
          {/* ==========================================
              PRODUCT GRID
          ========================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 p-2 sm:p-4">

            {products.map((product) => {

              // Django theke rating
              const rating = Number(product.rating || 0);

              return (
                <div
                  key={product.id}
                  className="
                    bg-white
                    p-4
                    rounded-xl
                    shadow-md

                    transition-all
                    duration-300
                    ease-in-out

                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >

                  {/* ==========================================
                      PRODUCT IMAGE
                  ========================================== */}

                  <img
                    src={`${BASEURL}${product.image}`}
                    alt={product.name}
                    className="w-full h-60 object-contain rounded mb-4"
                  />

                  {/* ==========================================
                      PRODUCT NAME
                  ========================================== */}

                  <h2 className="text-[16px] font-semibold mb-2">
                    {product.name}
                  </h2>

                  {/* ==========================================
                      PRICE + RATING
                  ========================================== */}

                  <div className="flex items-center justify-between mt-3">

                    {/* Price */}
                    <p className="text-lg text-green-600">
                      ৳ {product.price}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">

                      {[1, 2, 3, 4, 5].map((star) => {

                        // Full Star
                        if (rating >= star) {
                          return (
                            <FaStar
                              key={star}
                              className="text-yellow-400 text-sm"
                            />
                          );
                        }

                        // Half Star
                        if (rating >= star - 0.5) {
                          return (
                            <FaStarHalfAlt
                              key={star}
                              className="text-yellow-400 text-sm"
                            />
                          );
                        }

                        // Empty Star
                        return (
                          <FaRegStar
                            key={star}
                            className="text-gray-300 text-sm"
                          />
                        );
                      })}

                      {/* Rating Number */}
                      <span className="text-xs text-gray-500 ml-1">
                        ({rating.toFixed(1)})
                      </span>

                    </div>

                  </div>

                  {/* ==========================================
                      VIEW DETAILS
                  ========================================== */}

                  <Link
                    to={`/products/${product.id}`}
                    className="
                      mx-auto
                      block
                      text-center
                      mt-4
                      bg-[#C74500]
                      text-white
                      px-4
                      py-2
                      rounded-full
                    "
                  >
                    View Details
                  </Link>

                </div>
              );
            })}

          </div>

          {/* ==========================================
              PAGINATION
          ========================================== */}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-8">

              {/* ==========================================
                  PREVIOUS
              ========================================== */}

              <button
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`
                  px-4
                  py-2
                  rounded-lg
                  border
                  font-medium

                  ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                Previous
              </button>

              {/* ==========================================
                  PAGE NUMBERS
              ========================================== */}

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`
                    w-10
                    h-10
                    rounded-lg
                    font-medium

                    ${
                      currentPage === page
                        ? "bg-[#C74500] text-white"
                        : "bg-white text-gray-700 border hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              {/* ==========================================
                  NEXT
              ========================================== */}

              <button
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`
                  px-4
                  py-2
                  rounded-lg
                  border
                  font-medium

                  ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                Next
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
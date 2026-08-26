import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";


const ProductDetails = () => {
    
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const value = Number(product?.rating) || 0;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id, BASEURL]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Image */}
        {/* <div className='overflow-hidden rounded-lg'>
          <img
            src={`${BASEURL}${product.image}`}
            alt={product.name}
            className="w-full h-96 object-cover transition-all duration-500 hover:scale-110 hover:brightness-75"
          />
        </div> */}

          {/* ==============Custom magniffierr lense================= */}

                    <div
                  className="relative w-full h-96 overflow-hidden cursor-crosshair"
                  onMouseMove={(e) => {
                      const { left, top, width, height } =
                          e.currentTarget.getBoundingClientRect();

                      const x = ((e.clientX - left) / width) * 80;
                      const y = ((e.clientY - top) / height) * 80;

                      setPosition({ x, y });
                  }}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
              >
                  {/* Normal Image */}
                  <img
                      src={`${BASEURL}${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                  />

                  {/* Zoom Effect */}
                  {showZoom && (
                      <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                              backgroundImage: `url(${BASEURL}${product.image})`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "250% 250%",
                              backgroundPosition: `${position.x}% ${position.y}%`,
                          }}
                      />
                  )}
              </div>


          {/* =============================== */}

        {/* Product Information */}
        <div>
          <h1 className="text-xl font-semibold mb-2">
            {product.name}
          </h1>

          {/* Rating */}
                  <div className="flex items-center gap-1 text-orange-400">
                      {[1, 2, 3, 4, 5].map((star) => {
                          return star <= value ? (
                              <FaStar key={star} />
                          ) : (
                              <FaRegStar key={star} />
                          );
                      })}
                  </div>

          {/* Price */}
          <p className="text-3xl font-bold text-green-600 mt-5">
            BDT {product.price}
          </p>

          {/* Stock */}
          <p className="text-green-600 mt-3">
            In Stock ({product.stock})
          </p>

          {/* Description */}
          <p className="text-gray-600 mt-5">
            {product.description}
          </p>

          {/* Button */}
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

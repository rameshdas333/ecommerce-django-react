
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [BASEURL]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold underline text-center text-red-500 py-6">
        Product List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <img
              src={`${BASEURL}${product.image}`}
              alt={product.name}
              className="w-full h-48 object-contain rounded mb-4"
            />

            <h2 className="text-xl font-semibold mb-2">
              {product.name}
            </h2>

            <p className="text-lg text-green-600 mt-3">
              ৳ {product.price}
            </p>

            <Link
              to={`/products/${product.id}`}
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
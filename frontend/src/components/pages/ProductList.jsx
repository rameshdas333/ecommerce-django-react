
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

//   useEffect(() => {
//     fetch(`${BASEURL}/api/products/`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         return response.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, [BASEURL]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold underline text-center text-red-500 py-6">
//         Product List
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="bg-[#F5F5F5] p-4 rounded-lg shadow-md"
//           >
//             <img
//               src={`${BASEURL}${product.image}`}
//               alt={product.name}
//               className="w-full h-48 object-contain rounded mb-4"
//             />

//             <h2 className="text-xl font-semibold mb-2">
//               {product.name}
//             </h2>

//             <p className="text-lg text-green-600 mt-3">
//               ৳ {product.price}
//             </p>

//             <Link
//               to={`/products/${product.id}`}
//               className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               View Details
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

// =======================================




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  

//   const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

//   useEffect(() => {
//     fetch(`${BASEURL}/api/products/`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         return response.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, [BASEURL]);

//   // Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl font-semibold text-gray-600">
//           Loading...
//         </p>
//       </div>
//     );
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl font-semibold text-red-500">
//           Error: {error.message}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">

//       {/* Title */}
//       <h1 className="text-3xl font-bold underline text-center text-red-500 py-6">
//         Product List
//       </h1>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">

//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="
//               bg-white
//               p-4
//               rounded-xl
//               shadow-md

//               transition-all
//               duration-300
//               ease-in-out

//               hover:-translate-y-2
//               hover:shadow-2xl
//             "
//           >
//             {/* Product Image */}
//             <img
//               src={`${BASEURL}${product.image}`}
//               alt={product.name}
//               className="w-full h-60 object-contain rounded mb-4"
//             />

//             {/* Product Name */}
//             <h2 className="text-xl font-semibold mb-2">
//               {product.name}
//             </h2>

//             {/* Price */}
//             <p className="text-lg text-green-600 mt-3">
//               ৳ {product.price}
//             </p>

//             {/* View Details Button */}
//             <Link
//               to={`/products/${product.id}`}
//               className="
//                 inline-block
//                 mt-4
//                 bg-blue-600
//                 text-white
//                 px-4
//                 py-2
//                 rounded
//               "
//             >
//               View Details
//             </Link>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default ProductList;


// ======================================


import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL থেকে search নেওয়া
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Search থাকলে search API
    // Search না থাকলে normal API
    const url = search
      ? `${BASEURL}/api/products/?search=${encodeURIComponent(search)}`
      : `${BASEURL}/api/products/`;

    console.log("API URL:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products:", data);

        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Product fetch error:", error);

        setError(error);
        setLoading(false);
      });
  }, [BASEURL, search]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">

      {/* Title */}
     

      {/* Search Result Text */}
      {search && (
        <p className="text-center text-gray-600 mb-4">
          Search results for:{" "}
          <span className="font-semibold text-red-500">
            {search}
          </span>
        </p>
      )}

      {/* No Product */}
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-semibold text-gray-600">
            No products found.
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">

          {products.map((product) => (
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
              {/* Product Image */}
              <img
                src={`${BASEURL}${product.image}`}
                alt={product.name}
                className="w-full h-60 object-contain rounded mb-4"
              />

              {/* Product Name */}
              <h2 className="text-xl font-semibold mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <p className="text-lg text-green-600 mt-3">
                ৳ {product.price}
              </p>

              {/* View Details */}
              <Link
                to={`/products/${product.id}`}
                className="
                  inline-block
                  mt-4
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded
                "
              >
                View Details
              </Link>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default ProductList;





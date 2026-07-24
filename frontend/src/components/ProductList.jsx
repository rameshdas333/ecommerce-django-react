// import React from 'react'
// import { useState, useEffect } from 'react' 


// const ProductList = () => {
// const [products, setProducts] = useState([])
// const [loading, setLoading] = useState(true)
// const [error, setError] = useState(null)

// const BASEURL =import.meta.env.VITE_DJANGO_BASE_URL

// useEffect(() => {
//     fetch(`${BASEURL}/api/products/`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok')
//             }
//             return response.json()
//         })
//         .then(data => {
//             setProducts(data)
//             setLoading(false)
//         })
//         .catch(error => {
//             setError(error)
//             setLoading(false)
//         })
// },[])
//     if(loading) {
//     return <p>Loading...</p>
//      }   
    
//      if(error) {
//      return <p>Error: {error.message}</p>
//     }
//   return (
//     <div className="min-h-screen bg-gray-100">
//         <h1 className="text-3xl font-bold underline text-center text-red-500">
//             Product List
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//             {products.map((product) => (
//                 <div key={product.id} className="bg-white p-4 rounded shadow">
//                     <h2 className="text-xl font-semibold">{product.name}</h2>
//                     <img src={`${BASEURL}${product.image}`} alt={product.name} className="w-full h-48 object-cover mb-4" />
//                     <p className="text-gray-600">{product.description}</p>
//                     <p className="text-lg font-bold text-green-600">${product.price}</p>
//                 </div>
//             ))}
//         </div>
//     </div>
//   )
// }

// export default ProductList
import React, { useState, useEffect } from "react";

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
            {/* Product Image */}
            <img
              src={`${BASEURL}${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />

            {/* Product Name */}
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="text-yellow-400 text-lg">
                {"★".repeat(Math.round(product.rating || 0))}
                <span className="text-yellow-300">
                  {"★".repeat(5 - Math.round(product.rating || 0))}
                </span>
              </div>

              <span className="text-gray-600 text-sm">
                ({product.rating || 0}/5)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-2">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-lg font-bold text-green-600 mt-3">
              ${product.price}
            </p>

            {/* Stock */}
            <p className="text-sm text-gray-500 mt-2">
              In Stock: {product.stock}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import { toast } from "react-toastify";

// import { addToCart } from "../../redux/slices/cartSlice";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   // ================= STATES =================
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Image Zoom
//   const [position, setPosition] = useState({
//     x: 0,
//     y: 0,
//   });

//   const [showZoom, setShowZoom] = useState(false);

//   // Selected Size
//   const [selectedSize, setSelectedSize] = useState("");

//   const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

//   // Rating
//   const rating = Number(product?.rating) || 0;

//   // ================= FETCH PRODUCT =================
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(
//           `${BASEURL}/api/products/${id}/`
//         );

//         if (!response.ok) {
//           throw new Error("Product not found");
//         }

//         const data = await response.json();

//         console.log("Product Details:", data);

//         setProduct(data);
//       } catch (err) {
//         console.error("Product Error:", err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, BASEURL]);

//   // ================= ADD TO CART =================
//   const handleAddToCart = async () => {
//     if (!product) return;

//     // Out of stock check
//     if (Number(product.stock) <= 0) {
//       toast.error("This product is out of stock!");
//       return;
//     }

//     // Size check
//     if (product.sizes?.length > 0 && !selectedSize) {
//       toast.error("Please select a size!");
//       return;
//     }

//     try {
//       // ================= REDUX =================
//       // Cart page-এর জন্য সঠিক structure
//       dispatch(
//         addToCart({
//           id: product.id,
//           name: product.name || "",
//           price: Number(product.price) || 0,
//           image: product.image || "",
//           description: product.description || "",
//           stock: Number(product.stock) || 0,
//           selectedSize: selectedSize,
//           quantity: 1,
//         })
//       );

//       // ================= DJANGO DATABASE =================
//       const response = await fetch(`${BASEURL}/api/cart/add/`, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           product_id: product.id,
//           quantity: 1,
//         }),
//       });

//       if (!response.ok) {
//         let errorData = {};

//         try {
//           errorData = await response.json();
//         } catch {
//           errorData = {};
//         }

//         console.error("Django Cart Error:", errorData);

//         throw new Error("Failed to add product to cart");
//       }

//       const data = await response.json();

//       console.log("Django Cart:", data);

//       toast.success("Product added to cart! 🛒");
//     } catch (error) {
//       console.error("Cart Error:", error);

//       toast.error("Something went wrong!");
//     }
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex justify-center items-center">
//         <p className="text-lg">Loading...</p>
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (error) {
//     return (
//       <div className="min-h-[60vh] flex justify-center items-center">
//         <p className="text-red-500">
//           Error: {error.message}
//         </p>
//       </div>
//     );
//   }

//   // ================= PRODUCT NOT FOUND =================
//   if (!product) {
//     return (
//       <div className="min-h-[60vh] flex justify-center items-center">
//         <p>Product not found</p>
//       </div>
//     );
//   }

//   // ================= IMAGE URL =================
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `${BASEURL}${product.image}`
//     : "";

//   // ================= MAIN UI =================
//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6">
//       <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* ================= IMAGE ================= */}
//         <div
//           className="relative w-full h-80 sm:h-96 overflow-hidden cursor-crosshair"
//           onMouseMove={(e) => {
//             const { left, top, width, height } =
//               e.currentTarget.getBoundingClientRect();

//             const x = ((e.clientX - left) / width) * 100;
//             const y = ((e.clientY - top) / height) * 100;

//             setPosition({ x, y });
//           }}
//           onMouseEnter={() => setShowZoom(true)}
//           onMouseLeave={() => setShowZoom(false)}
//         >
//           {imageUrl ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={product.name || "Product"}
//                 className="w-full h-full object-contain"
//               />

//               {/* Image Zoom */}
//               {showZoom && (
//                 <div
//                   className="absolute inset-0 pointer-events-none"
//                   style={{
//                     backgroundImage: `url(${imageUrl})`,
//                     backgroundRepeat: "no-repeat",
//                     backgroundSize: "250% 250%",
//                     backgroundPosition: `${position.x}% ${position.y}%`,
//                   }}
//                 />
//               )}
//             </>
//           ) : (
//             <div className="w-full h-full flex justify-center items-center text-gray-400">
//               No Image Available
//             </div>
//           )}
//         </div>

//         {/* ================= PRODUCT INFORMATION ================= */}
//         <div>
          
//           {/* Product Name */}
//           <h1 className="text-xl sm:text-2xl font-semibold mb-3">
//             {product.name}
//           </h1>

//           {/* ================= RATING ================= */}
//           <div className="flex items-center gap-1 text-orange-400">
//             {[1, 2, 3, 4, 5].map((star) =>
//               star <= rating ? (
//                 <FaStar key={star} />
//               ) : (
//                 <FaRegStar key={star} />
//               )
//             )}
//           </div>

//           {/* Rating Number */}
//           <p className="text-sm text-gray-500 mt-2">
//             Rating: {rating.toFixed(1)} / 5
//           </p>

//           {/* ================= PRICE ================= */}
//           <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-5">
//             BDT {Number(product.price || 0).toFixed(2)}
//           </p>

//           {/* ================= STOCK ================= */}
//           <p
//             className={`mt-3 font-medium ${
//               Number(product.stock) > 0
//                 ? "text-green-600"
//                 : "text-red-500"
//             }`}
//           >
//             {Number(product.stock) > 0
//               ? `In Stock (${product.stock})`
//               : "Out of Stock"}
//           </p>

//           {/* ================= DESCRIPTION ================= */}
//           <p className="text-gray-600 mt-5 leading-relaxed">
//             {product.description || "No description available."}
//           </p>

//           {/* ================= SIZE ================= */}
//           {product.sizes?.length > 0 && (
//             <div className="mt-6">
//               <h3 className="font-medium mb-3">
//                 Select Size
//               </h3>

//               <div className="flex flex-wrap gap-3">
//                 {product.sizes.map((item) => (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => setSelectedSize(item.size)}
//                     className={`px-5 py-2 border rounded-lg transition ${
//                       selectedSize === item.size
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white hover:border-blue-500"
//                     }`}
//                   >
//                     {item.size}
//                   </button>
//                 ))}
//               </div>

//               {/* Selected Size */}
//               {selectedSize && (
//                 <p className="text-sm text-gray-500 mt-3">
//                   Selected Size: {selectedSize}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* ================= ADD TO CART ================= */}
//           <button
//             type="button"
//             onClick={handleAddToCart}
//             disabled={Number(product.stock) <= 0}
//             className={`mt-8 px-8 py-3 rounded-lg text-white font-medium transition ${
//               Number(product.stock) <= 0
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {Number(product.stock) <= 0
//               ? "Out of Stock"
//               : "Add to Cart 🛒"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ================= STATES =================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image Zoom
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [showZoom, setShowZoom] = useState(false);

  // Size
  const [selectedSize, setSelectedSize] = useState("");

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // ================= FETCH PRODUCT =================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASEURL}/api/products/${id}/`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("Product Details:", data);

        setProduct(data);

      } catch (err) {
        console.error("Product Error:", err);
        setError(err);

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, BASEURL]);

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    if (!product) return;

    // Out of stock check
    if (Number(product.stock) <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    // Size check
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    try {
      // ================= REDUX =================

      dispatch(
        addToCart({
          id: product.id,
          name: product.name || "",
          price: Number(product.price) || 0,
          image: product.image || "",
          description: product.description || "",
          stock: Number(product.stock) || 0,
          selectedSize: selectedSize,

          // প্রথমবার Cart-এ quantity 1
          quantity: 1,
        })
      );

      // ================= DJANGO CART DATABASE =================

      const response = await fetch(
        `${BASEURL}/api/cart/add/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        console.error(
          "Django Cart Error:",
          errorData
        );

        throw new Error("Failed to add product to cart");
      }

      const data = await response.json();

      console.log("Django Cart:", data);

      toast.success("Product added to cart! 🛒");

    } catch (err) {
      console.error("Cart Error:", err);

      toast.error("Something went wrong!");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-lg">
          Loading...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-red-500">
          Error: {error.message}
        </p>
      </div>
    );
  }

  // ================= PRODUCT NOT FOUND =================

  if (!product) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p>
          Product not found
        </p>
      </div>
    );
  }

  // ================= IMAGE URL =================

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image}`
    : "";

  // Rating
  const rating = Number(product.rating) || 0;

  // ================= MAIN UI =================

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      <div
        className="
          bg-white shadow-lg rounded-lg
          p-4 sm:p-6
          grid grid-cols-1 md:grid-cols-2
          gap-8
        "
      >

        {/* ================= IMAGE ================= */}

        <div
          className="
            relative
            w-full
            h-80 sm:h-96
            overflow-hidden
            cursor-crosshair
          "
          onMouseMove={(e) => {
            const { left, top, width, height } =
              e.currentTarget.getBoundingClientRect();

            const x =
              ((e.clientX - left) / width) * 100;

            const y =
              ((e.clientY - top) / height) * 100;

            setPosition({ x, y });
          }}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >

          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product.name || "Product"}
                className="
                  w-full
                  h-full
                  object-contain
                "
              />

              {/* ================= IMAGE ZOOM ================= */}

              {showZoom && (
                <div
                  className="
                    absolute inset-0
                    pointer-events-none
                  "
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "250% 250%",
                    backgroundPosition:
                      `${position.x}% ${position.y}%`,
                  }}
                />
              )}

            </>
          ) : (

            <div
              className="
                w-full h-full
                flex justify-center items-center
                text-gray-400
              "
            >
              No Image Available
            </div>

          )}

        </div>

        {/* ================= PRODUCT INFORMATION ================= */}

        <div>

          {/* Product Name */}

          <h1
            className="
              text-xl sm:text-2xl
              font-semibold
              mb-3
            "
          >
            {product.name}
          </h1>

          {/* ================= RATING ================= */}

          <div
            className="
              flex items-center
              gap-1
              text-orange-400
            "
          >

            {[1, 2, 3, 4, 5].map((star) =>
              star <= rating ? (
                <FaStar key={star} />
              ) : (
                <FaRegStar key={star} />
              )
            )}

          </div>

          <p className="text-sm text-gray-500 mt-2">
            Rating: {rating.toFixed(1)} / 5
          </p>

          {/* ================= PRICE ================= */}

          <p
            className="
              text-2xl sm:text-3xl
              font-bold
              text-green-600
              mt-5
            "
          >
            BDT {Number(product.price || 0).toFixed(2)}
          </p>

          {/* ================= STOCK ================= */}

          <p
            className={`mt-3 font-medium ${
              Number(product.stock) > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {Number(product.stock) > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </p>

          {/* ================= DESCRIPTION ================= */}

          <p
            className="
              text-gray-600
              mt-5
              leading-relaxed
            "
          >
            {product.description ||
              "No description available."}
          </p>

          {/* ================= SIZE ================= */}

          {product.sizes?.length > 0 && (
            <div className="mt-6">

              <h3 className="font-medium mb-3">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.sizes.map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelectedSize(item.size)
                    }
                    className={`
                      px-5 py-2
                      border rounded-lg
                      transition
                      ${
                        selectedSize === item.size
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:border-blue-500"
                      }
                    `}
                  >
                    {item.size}
                  </button>

                ))}

              </div>

              {selectedSize && (
                <p className="text-sm text-gray-500 mt-3">
                  Selected Size: {selectedSize}
                </p>
              )}

            </div>
          )}

          {/* ================= ADD TO CART ================= */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={Number(product.stock) <= 0}
            className={`
              mt-8
              px-8 py-3
              rounded-lg
              text-white
              font-medium
              transition
              ${
                Number(product.stock) <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {Number(product.stock) <= 0
              ? "Out of Stock"
              : "Add to Cart 🛒"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
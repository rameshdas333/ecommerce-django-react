// // import { useState } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // import {
// //   clearCart
// // } from "../../redux/slices/cartSlice";

// // const Checkout = () => {
// //   const cartItems = useSelector(
// //     (state) => state.cart.cartItems
// //   );

// //   const couponCode = useSelector(
// //     (state) => state.cart.couponCode
// //   );

// //   const discountPercent = useSelector(
// //     (state) => state.cart.discountPercent
// //   );

// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

// //   const [loading, setLoading] = useState(false);

// //   const [billingData, setBillingData] = useState({
// //     first_name: "",
// //     company_name: "",
// //     street_address: "",
// //     apartment: "",
// //     town_city: "",
// //     phone_number: "",
// //     email: "",
// //     payment_method: "cash_on_delivery",
// //   });

// //   // ================= INPUT CHANGE =================
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     setBillingData((previous) => ({
// //       ...previous,
// //       [name]: value,
// //     }));
// //   };

// //   // ================= SUBTOTAL =================
// //   const subtotal = cartItems.reduce(
// //     (total, item) =>
// //       total +
// //       Number(item.price) *
// //       Number(item.quantity),
// //     0
// //   );

// //   // ================= TOTAL PRODUCT QUANTITY =================
// //   const totalQuantity = cartItems.reduce(
// //     (total, item) =>
// //       total + Number(item.quantity),
// //     0
// //   );

// //   // ================= SHIPPING =================
// //   let shipping = 0;

// //   if (totalQuantity === 1) {
// //     shipping = 80;

// //   } else if (totalQuantity === 2) {
// //     shipping = 120;

// //   } else if (totalQuantity === 3) {
// //     shipping = 150;

// //   } else if (totalQuantity === 4) {
// //     shipping = 180;

// //   } else if (totalQuantity >= 5 && totalQuantity < 10) {
// //     shipping = 210;

// //   } else if (totalQuantity >= 10 && totalQuantity < 15) {
// //     shipping = 310;

// //   } else if (totalQuantity >= 15 && totalQuantity < 20) {
// //     shipping = 410;

// //   } else if (totalQuantity >= 20) {
// //     shipping = 500;
// //   }

// //   // ================= DISCOUNT =================
// //   const discount =
// //     subtotal *
// //     (Number(discountPercent) / 100);

// //   // ================= TOTAL =================
// //   const total =
// //     subtotal + shipping - discount;

// //   // ================= PLACE ORDER =================
// //  const handlePlaceOrder = async (e) => {
// //   e.preventDefault();

// //   if (cartItems.length === 0) {
// //     alert("Your cart is empty!");
// //     return;
// //   }

// //   try {
// //     setLoading(true);

// //     // Token নেওয়া
// //     const token = localStorage.getItem("accessToken");

// //     // Order data তৈরি
// //     const orderData = {
// //       ...billingData,

// //       coupon_code: couponCode,

// //       subtotal: subtotal,

// //       discount: discount,

// //       shipping_charge: shipping,

// //       total_amount: total,

// //       items: cartItems.map((item) => ({
// //         product: item.id,
// //         quantity: item.quantity,
// //       })),
// //     };

// //     // ================= DJANGO API =================
// //     const response = await axios.post(
// //       "http://127.0.0.1:8000/api/orders/",
// //       orderData,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     console.log(response.data);

// //     alert("Order placed successfully! 🎉");

// //     dispatch(clearCart());

// //     navigate("/order-success");

// //   } catch (error) {

// //     console.error(
// //       error.response?.data || error.message
// //     );

// //     alert("Order failed!");

// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   // ================= EMPTY CART =================
// //   if (cartItems.length === 0) {
// //     return (
// //       <div className="min-h-[70vh] flex flex-col items-center justify-center">

// //         <h2 className="text-xl font-semibold">
// //           Your cart is empty 🛒
// //         </h2>

// //         <button
// //           type="button"
// //           onClick={() => navigate("/")}
// //           className="mt-5 bg-red-500 text-white px-6 py-3 rounded-lg"
// //         >
// //           Continue Shopping
// //         </button>

// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

// //       <form
// //         onSubmit={handlePlaceOrder}
// //         className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
// //       >

// //         {/* ================= BILLING DETAILS ================= */}
// //         <div>

// //           <h1 className="text-2xl md:text-3xl font-semibold mb-8">
// //             Billing Details
// //           </h1>

// //           {/* FIRST NAME */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               First Name *
// //             </label>

// //             <input
// //               type="text"
// //               name="first_name"
// //               required
// //               value={billingData.first_name}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* COMPANY */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Company Name
// //             </label>

// //             <input
// //               type="text"
// //               name="company_name"
// //               value={billingData.company_name}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* STREET ADDRESS */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Street Address *
// //             </label>

// //             <input
// //               type="text"
// //               name="street_address"
// //               required
// //               value={billingData.street_address}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* APARTMENT */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Apartment, floor, etc.
// //             </label>

// //             <input
// //               type="text"
// //               name="apartment"
// //               value={billingData.apartment}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* CITY */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Town / City *
// //             </label>

// //             <input
// //               type="text"
// //               name="town_city"
// //               required
// //               value={billingData.town_city}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* PHONE */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Phone Number *
// //             </label>

// //             <input
// //               type="text"
// //               name="phone_number"
// //               required
// //               value={billingData.phone_number}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //           {/* EMAIL */}
// //           <div className="mb-5">

// //             <label className="block mb-2">
// //               Email Address *
// //             </label>

// //             <input
// //               type="email"
// //               name="email"
// //               required
// //               value={billingData.email}
// //               onChange={handleChange}
// //               className="w-full border p-3 rounded"
// //             />

// //           </div>

// //         </div>

// //         {/* ================= ORDER SUMMARY ================= */}
// //         <div>

// //           <h2 className="text-2xl font-semibold mb-6">
// //             Your Order
// //           </h2>

// //           {/* ================= PRODUCTS ================= */}
// //           <div className="border-b pb-4">

// //             {cartItems.map((item) => (

// //               <div
// //                 key={`${item.id}-${item.selectedSize || ""}`}
// //                 className="flex justify-between items-center mb-5 gap-4"
// //               >

// //                 <div className="flex items-center gap-3">

// //                   <img
// //                     src={
// //                       item.image?.startsWith("http")
// //                         ? item.image
// //                         : `${BASEURL}${item.image}`
// //                     }
// //                     alt={item.name}
// //                     className="w-14 h-14 object-cover"
// //                   />

// //                   <div>

// //                     <h3 className="font-medium">
// //                       {item.name}
// //                     </h3>

// //                     {item.selectedSize && (
// //                       <p className="text-gray-500 text-sm">
// //                         Size: {item.selectedSize}
// //                       </p>
// //                     )}

// //                     <p className="text-gray-500 text-sm">
// //                       Quantity: {item.quantity}
// //                     </p>

// //                   </div>

// //                 </div>

// //                 <p>
// //                   BDT{" "}
// //                   {(
// //                     Number(item.price) *
// //                     Number(item.quantity)
// //                   ).toFixed(2)}
// //                 </p>

// //               </div>

// //             ))}

// //           </div>

// //           {/* ================= TOTAL PRODUCTS ================= */}
// //           <div className="py-4 border-b flex justify-between">

// //             <span>Total Products:</span>

// //             <span>
// //               {totalQuantity}
// //             </span>

// //           </div>

// //           {/* ================= SUBTOTAL ================= */}
// //           <div className="py-4 border-b flex justify-between">

// //             <span>Subtotal:</span>

// //             <span>
// //               BDT {subtotal.toFixed(2)}
// //             </span>

// //           </div>

// //           {/* ================= DISCOUNT ================= */}
// //           {discount > 0 && (

// //             <div className="py-4 border-b flex justify-between text-green-600">

// //               <span>
// //                 Discount ({discountPercent}%):
// //               </span>

// //               <span>
// //                 - BDT {discount.toFixed(2)}
// //               </span>

// //             </div>

// //           )}

// //           {/* ================= SHIPPING ================= */}
// //           <div className="py-4 border-b flex justify-between">

// //             <span>Shipping:</span>

// //             <span>
// //               BDT {shipping.toFixed(2)}
// //             </span>

// //           </div>

// //           {/* ================= TOTAL ================= */}
// //           <div className="py-4 flex justify-between text-lg font-semibold">

// //             <span>Total:</span>

// //             <span>
// //               BDT {total.toFixed(2)}
// //             </span>

// //           </div>

// //           {/* ================= PAYMENT ================= */}
// //           <div className="mt-6 space-y-4">

// //             <label className="flex items-center gap-3">

// //               <input
// //                 type="radio"
// //                 name="payment_method"
// //                 value="bank"
// //                 checked={
// //                   billingData.payment_method === "bank"
// //                 }
// //                 onChange={handleChange}
// //               />

// //               Bank

// //             </label>

// //             <label className="flex items-center gap-3">

// //               <input
// //                 type="radio"
// //                 name="payment_method"
// //                 value="cash_on_delivery"
// //                 checked={
// //                   billingData.payment_method ===
// //                   "cash_on_delivery"
// //                 }
// //                 onChange={handleChange}
// //               />

// //               Cash on Delivery

// //             </label>

// //           </div>

// //           {/* ================= PLACE ORDER ================= */}
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full mt-8 bg-red-500 text-white px-10 py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
// //           >
// //             {loading
// //               ? "Placing Order..."
// //               : "Place Order"}
// //           </button>

// //         </div>

// //       </form>

// //     </div>
// //   );
// // };

// // export default Checkout;

// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import { clearCart } from "../../redux/slices/cartSlice";

// const Checkout = () => {
//   // ================= REDUX DATA =================
//   const cartItems = useSelector(
//     (state) => state.cart.cartItems
//   );

//   const couponCode = useSelector(
//     (state) => state.cart.couponCode
//   );

//   const discountPercent = useSelector(
//     (state) => state.cart.discountPercent
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ================= BASE URL =================
//   const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

//   // ================= LOADING =================
//   const [loading, setLoading] = useState(false);

//   // ================= BILLING DATA =================
//   const [billingData, setBillingData] = useState({
//     first_name: "",
//     company_name: "",
//     street_address: "",
//     apartment: "",
//     town_city: "",
//     phone_number: "",
//     email: "",
//     payment_method: "cash_on_delivery",
//   });

//   // ================= INPUT CHANGE =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setBillingData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // ================= SUBTOTAL =================
//   const subtotal = cartItems.reduce(
//     (total, item) =>
//       total +
//       Number(item.price) * Number(item.quantity),
//     0
//   );

//   // ================= TOTAL QUANTITY =================
//   const totalQuantity = cartItems.reduce(
//     (total, item) =>
//       total + Number(item.quantity),
//     0
//   );

//   // ================= SHIPPING =================
//   let shipping = 0;

//   if (totalQuantity === 1) {
//     shipping = 80;
//   } else if (totalQuantity === 2) {
//     shipping = 120;
//   } else if (totalQuantity === 3) {
//     shipping = 150;
//   } else if (totalQuantity === 4) {
//     shipping = 180;
//   } else if (totalQuantity >= 5 && totalQuantity < 10) {
//     shipping = 210;
//   } else if (totalQuantity >= 10 && totalQuantity < 15) {
//     shipping = 310;
//   } else if (totalQuantity >= 15 && totalQuantity < 20) {
//     shipping = 410;
//   } else if (totalQuantity >= 20) {
//     shipping = 500;
//   }

//   // ================= DISCOUNT =================
//   const discount =
//     subtotal * (Number(discountPercent || 0) / 100);

//   // ================= TOTAL =================
//   const total = subtotal + shipping - discount;

//   // ================= PLACE ORDER =================
//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     // Empty cart check
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ================= TOKEN =================
//       const token = localStorage.getItem("accessToken");

//       // ================= ORDER DATA =================
//       const orderData = {
//         ...billingData,

//         coupon_code: couponCode || "",

//         subtotal: Number(subtotal.toFixed(2)),

//         discount: Number(discount.toFixed(2)),

//         shipping_charge: Number(shipping.toFixed(2)),

//         total_amount: Number(total.toFixed(2)),

//         items: cartItems.map((item) => ({
//           product: item.id,
//           quantity: Number(item.quantity),
//         })),
//       };

//       console.log("ORDER DATA:", orderData);

//       // ================= DJANGO API =================
//       const response = await axios.post(
//         `${BASEURL}/api/orders/`,
//         orderData,
//         {
//           headers: {
//             "Content-Type": "application/json",

//             ...(token && {
//               Authorization: `Bearer ${token}`,
//             }),
//           },
//         }
//       );

//       console.log("ORDER SUCCESS:", response.data);

//       // ================= SUCCESS =================
//       alert("Order placed successfully! 🎉");

//       // Redux cart clear
//       dispatch(clearCart());

//       // Success page
//       navigate("/order-success");

//     } catch (error) {

//       // ================= ERROR =================
//       console.error(
//         "ORDER ERROR:",
//         error.response?.data || error.message
//       );

//       // Django error দেখাবে
//       const errorData =
//         error.response?.data || error.message;

//       alert(
//         typeof errorData === "object"
//           ? JSON.stringify(errorData, null, 2)
//           : errorData
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= EMPTY CART =================
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center">
//         <h2 className="text-xl font-semibold">
//           Your cart is empty 🛒
//         </h2>

//         <button
//           type="button"
//           onClick={() => navigate("/")}
//           className="mt-5 bg-red-500 text-white px-6 py-3 rounded-lg"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

//       <form
//         onSubmit={handlePlaceOrder}
//         className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
//       >

//         {/* ================= BILLING DETAILS ================= */}
//         <div>

//           <h1 className="text-2xl md:text-3xl font-semibold mb-8">
//             Billing Details
//           </h1>

//           {/* FIRST NAME */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               First Name *
//             </label>

//             <input
//               type="text"
//               name="first_name"
//               required
//               value={billingData.first_name}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* COMPANY */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Company Name
//             </label>

//             <input
//               type="text"
//               name="company_name"
//               value={billingData.company_name}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* STREET ADDRESS */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Street Address *
//             </label>

//             <input
//               type="text"
//               name="street_address"
//               required
//               value={billingData.street_address}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* APARTMENT */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Apartment, floor, etc.
//             </label>

//             <input
//               type="text"
//               name="apartment"
//               value={billingData.apartment}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* CITY */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Town / City *
//             </label>

//             <input
//               type="text"
//               name="town_city"
//               required
//               value={billingData.town_city}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* PHONE */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Phone Number *
//             </label>

//             <input
//               type="text"
//               name="phone_number"
//               required
//               value={billingData.phone_number}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//           {/* EMAIL */}
//           <div className="mb-5">
//             <label className="block mb-2">
//               Email Address *
//             </label>

//             <input
//               type="email"
//               name="email"
//               required
//               value={billingData.email}
//               onChange={handleChange}
//               className="w-full border p-3 rounded"
//             />
//           </div>

//         </div>

//         {/* ================= ORDER SUMMARY ================= */}
//         <div>

//           <h2 className="text-2xl font-semibold mb-6">
//             Your Order
//           </h2>

//           {/* PRODUCTS */}
//           <div className="border-b pb-4">

//             {cartItems.map((item) => (
//               <div
//                 key={`${item.id}-${item.selectedSize || ""}`}
//                 className="flex justify-between items-center mb-5 gap-4"
//               >

//                 <div className="flex items-center gap-3">

//                   <img
//                     src={
//                       item.image?.startsWith("http")
//                         ? item.image
//                         : `${BASEURL}${item.image}`
//                     }
//                     alt={item.name}
//                     className="w-14 h-14 object-cover"
//                   />

//                   <div>

//                     <h3 className="font-medium">
//                       {item.name}
//                     </h3>

//                     {item.selectedSize && (
//                       <p className="text-gray-500 text-sm">
//                         Size: {item.selectedSize}
//                       </p>
//                     )}

//                     <p className="text-gray-500 text-sm">
//                       Quantity: {item.quantity}
//                     </p>

//                   </div>

//                 </div>

//                 <p>
//                   BDT{" "}
//                   {(
//                     Number(item.price) *
//                     Number(item.quantity)
//                   ).toFixed(2)}
//                 </p>

//               </div>
//             ))}

//           </div>

//           {/* TOTAL PRODUCTS */}
//           <div className="py-4 border-b flex justify-between">
//             <span>Total Products:</span>

//             <span>
//               {totalQuantity}
//             </span>
//           </div>

//           {/* SUBTOTAL */}
//           <div className="py-4 border-b flex justify-between">
//             <span>Subtotal:</span>

//             <span>
//               BDT {subtotal.toFixed(2)}
//             </span>
//           </div>

//           {/* DISCOUNT */}
//           {discount > 0 && (
//             <div className="py-4 border-b flex justify-between text-green-600">

//               <span>
//                 Discount ({discountPercent}%):
//               </span>

//               <span>
//                 - BDT {discount.toFixed(2)}
//               </span>

//             </div>
//           )}

//           {/* SHIPPING */}
//           <div className="py-4 border-b flex justify-between">

//             <span>Shipping:</span>

//             <span>
//               BDT {shipping.toFixed(2)}
//             </span>

//           </div>

//           {/* TOTAL */}
//           <div className="py-4 flex justify-between text-lg font-semibold">

//             <span>Total:</span>

//             <span>
//               BDT {total.toFixed(2)}
//             </span>

//           </div>

//           {/* ================= PAYMENT ================= */}
//           <div className="mt-6 space-y-4">

//             <label className="flex items-center gap-3">

//               <input
//                 type="radio"
//                 name="payment_method"
//                 value="bank"
//                 checked={
//                   billingData.payment_method === "bank"
//                 }
//                 onChange={handleChange}
//               />

//               Bank

//             </label>

//             <label className="flex items-center gap-3">

//               <input
//                 type="radio"
//                 name="payment_method"
//                 value="cash_on_delivery"
//                 checked={
//                   billingData.payment_method ===
//                   "cash_on_delivery"
//                 }
//                 onChange={handleChange}
//               />

//               Cash on Delivery

//             </label>

//           </div>

//           {/* ================= PLACE ORDER ================= */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-8 bg-red-500 text-white px-10 py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
//           >
//             {loading
//               ? "Placing Order..."
//               : "Place Order"}
//           </button>

//         </div>

//       </form>

//     </div>
//   );
// };

// export default Checkout;





// ========================================================





import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  // ================= REDUX DATA =================
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const couponCode = useSelector(
    (state) => state.cart.couponCode
  );

  const discountPercent = useSelector(
    (state) => state.cart.discountPercent
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= BASE URL =================
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // ================= LOADING =================
  const [loading, setLoading] = useState(false);

  // ================= BILLING DATA =================
  const [billingData, setBillingData] = useState({
    first_name: "",
    company_name: "",
    street_address: "",
    apartment: "",
    town_city: "",
    phone_number: "",
    email: "",
    payment_method: "cash_on_delivery",
  });

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBillingData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= SUBTOTAL =================
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity),
    0
  );

  // ================= TOTAL QUANTITY =================
  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  // ================= SHIPPING =================
  let shipping = 0;

  if (totalQuantity === 1) {
    shipping = 80;
  } else if (totalQuantity === 2) {
    shipping = 120;
  } else if (totalQuantity === 3) {
    shipping = 150;
  } else if (totalQuantity === 4) {
    shipping = 180;
  } else if (totalQuantity >= 5 && totalQuantity < 10) {
    shipping = 210;
  } else if (totalQuantity >= 10 && totalQuantity < 15) {
    shipping = 310;
  } else if (totalQuantity >= 15 && totalQuantity < 20) {
    shipping = 410;
  } else if (totalQuantity >= 20) {
    shipping = 500;
  }

  // ================= DISCOUNT =================
  const discount =
    subtotal * (Number(discountPercent || 0) / 100);

  // ================= TOTAL =================
  const total = subtotal + shipping - discount;


  
  // ================= PLACE ORDER =================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Empty cart check
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);

      // ================= TOKEN =================
      const token = localStorage.getItem("accessToken");

      // ================= LOGIN CHECK =================
      if (!token) {
        alert("Please login first!");

        navigate("/login");

        return;
      }

      // ================= ORDER DATA =================
      const orderData = {
        ...billingData,

        coupon_code: couponCode || "",

        subtotal: Number(subtotal.toFixed(2)),

        discount: Number(discount.toFixed(2)),

        shipping_charge: Number(shipping.toFixed(2)),

        total_amount: Number(total.toFixed(2)),

        // ================= ORDER ITEMS =================
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: Number(item.quantity),

          // IMPORTANT: BACKEND PRICE REQUIRED
          price: Number(item.price),
        })),
      };

      console.log("ORDER DATA:", orderData);

      // ================= DJANGO API =================
      const response = await axios.post(
        `${BASEURL}/api/orders/`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDER SUCCESS:", response.data);

      // ================= SUCCESS =================
      toast.success("Order placed successfully! 🎉");

      // Redux cart clear
      dispatch(clearCart());

      // Success page
      navigate("/order-success");

    } catch (error) {

      // ================= ERROR =================
      console.error(
        "ORDER ERROR:",
        error.response?.data || error.message
      );

      // Django error
      const errorData =
        error.response?.data || error.message;

      toast.error(
        typeof errorData === "object"
          ? JSON.stringify(errorData, null, 2)
          : errorData
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= EMPTY CART =================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">

        <h2 className="text-xl font-semibold">
          Your cart is empty 🛒
        </h2>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
      >

        {/* ================= BILLING DETAILS ================= */}
        <div>

          <h1 className="text-2xl md:text-3xl font-semibold mb-8">
            Billing Details
          </h1>

          {/* FIRST NAME */}
          <div className="mb-5">

            <label className="block mb-2">
              First Name *
            </label>

            <input
              type="text"
              name="first_name"
              required
              value={billingData.first_name}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* COMPANY */}
          <div className="mb-5">

            <label className="block mb-2">
              
              Last Name
            </label>

            <input
              type="text"
              name="company_name"
              value={billingData.company_name}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* STREET ADDRESS */}
          <div className="mb-5">

            <label className="block mb-2">
              Street Address *
            </label>

            <input
              type="text"
              name="street_address"
              required
              value={billingData.street_address}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* APARTMENT */}
          <div className="mb-5">

            <label className="block mb-2">
              Apartment, floor, etc.
            </label>

            <input
              type="text"
              name="apartment"
              value={billingData.apartment}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* CITY */}
          <div className="mb-5">

            <label className="block mb-2">
              Town / City *
            </label>

            <input
              type="text"
              name="town_city"
              required
              value={billingData.town_city}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* PHONE */}
          <div className="mb-5">

            <label className="block mb-2">
              Phone Number *
            </label>

            <input
              type="text"
              name="phone_number"
              required
              value={billingData.phone_number}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label className="block mb-2">
              Email Address *
            </label>

            <input
              type="email"
              name="email"
              required
              value={billingData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>

        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Your Order
          </h2>

          {/* PRODUCTS */}
          <div className="border-b pb-4">

            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize || ""}`}
                className="flex justify-between items-center mb-5 gap-4"
              >

                <div className="flex items-center gap-3">

                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${BASEURL}${item.image}`
                    }
                    alt={item.name}
                    className="w-14 h-14 object-cover"
                  />

                  <div>

                    <h3 className="font-medium">
                      {item.name}
                    </h3>

                    {item.selectedSize && (
                      <p className="text-gray-500 text-sm">
                        Size: {item.selectedSize}
                      </p>
                    )}

                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                </div>

                <p>
                  BDT{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </p>

              </div>
            ))}

          </div>

          {/* TOTAL PRODUCTS */}
          <div className="py-4 border-b flex justify-between">
            <span>Total Products:</span>

            <span>
              {totalQuantity}
            </span>
          </div>

          {/* SUBTOTAL */}
          <div className="py-4 border-b flex justify-between">
            <span>Subtotal:</span>

            <span>
              BDT {subtotal.toFixed(2)}
            </span>
          </div>

          {/* DISCOUNT */}
          {discount > 0 && (
            <div className="py-4 border-b flex justify-between text-green-600">

              <span>
                Discount ({discountPercent}%):
              </span>

              <span>
                - BDT {discount.toFixed(2)}
              </span>

            </div>
          )}

          {/* SHIPPING */}
          <div className="py-4 border-b flex justify-between">

            <span>Shipping:</span>

            <span>
              BDT {shipping.toFixed(2)}
            </span>

          </div>

          {/* TOTAL */}
          <div className="py-4 flex justify-between text-lg font-semibold">

            <span>Total:</span>

            <span>
              BDT {total.toFixed(2)}
            </span>

          </div>

          {/* ================= PAYMENT ================= */}
          <div className="mt-6 space-y-4">

            <label className="flex items-center gap-3">

              <input
                type="radio"
                name="payment_method"
                value="bank"
                checked={
                  billingData.payment_method === "bank"
                }
                onChange={handleChange}
              />

              Bank

            </label>

            <label className="flex items-center gap-3">

              <input
                type="radio"
                name="payment_method"
                value="cash_on_delivery"
                checked={
                  billingData.payment_method ===
                  "cash_on_delivery"
                }
                onChange={handleChange}
              />

              Cash on Delivery

            </label>

          </div>

          {/* ================= PLACE ORDER ================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-red-500 text-white px-10 py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default Checkout;
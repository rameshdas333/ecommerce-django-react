import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  updateQuantity,
  setCoupon,
  clearCoupon,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const couponCode = useSelector(
    (state) => state.cart.couponCode
  );

  const discountPercent = useSelector(
    (state) => state.cart.discountPercent
  );

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [coupon, setCouponInput] = useState(couponCode || "");

  // ================= SUBTOTAL =================
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
      Number(item.quantity),
    0
  );

  // ================= TOTAL PRODUCT QUANTITY =================
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
    subtotal * (Number(discountPercent) / 100);

  // ================= TOTAL =================
  const total =
    subtotal + shipping - discount;

  // ================= APPLY COUPON =================
  const handleApplyCoupon = () => {
    const enteredCoupon =
      coupon.trim().toUpperCase();

    if (enteredCoupon === "BU67") {
      dispatch(
        setCoupon({
          couponCode: "BU67",
          discountPercent: 20,
        })
      );

      toast.success(
        "🎉 BU67 coupon applied! You got 20% discount."
      );

    } else {
      dispatch(clearCoupon());

      toast.error("❌ Invalid coupon code!");
    }
  };

  // ================= DECREMENT =================
  const handleDecreaseQuantity = (item) => {

    // Quantity 
    if (Number(item.quantity) <= 1) {
      return;
    }

    dispatch(
      updateQuantity({
        id: item.id,
        quantity: Number(item.quantity) - 1,
      })
    );
  };

  // ================= INCREMENT =================
  const handleIncreaseQuantity = (item) => {

    // Stock 
    if (
      Number(item.stock) > 0 &&
      Number(item.quantity) >= Number(item.stock)
    ) {
      toast.error("Maximum stock reached!");
      return;
    }

    dispatch(
      updateQuantity({
        id: item.id,
        quantity: Number(item.quantity) + 1,
      })
    );
  };

  // ================= EMPTY CART =================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 text-center">

        <h2 className="text-xl font-medium">
          Your Cart is Empty 🛒
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Please add some products to your cart.
        </p>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-semibold mb-6">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= CART ITEMS ================= */}
        <div className="lg:col-span-2 space-y-5">

          {cartItems.map((item) => (

            <div
              key={`${item.id}-${item.selectedSize || ""}`}
              className="bg-gray-100 shadow rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5"
            >

              {/* ================= IMAGE ================= */}
              <div className="w-32 h-32 flex-shrink-0">

                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${BASEURL}${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-full object-contain"
                />

              </div>

              {/* ================= PRODUCT INFO ================= */}
              <div className="flex-1">

                <h2 className="text-base font-medium">
                  {item.name}
                </h2>

                {item.selectedSize && (
                  <p className="text-sm text-gray-500 mt-1">
                    Size: {item.selectedSize}
                  </p>
                )}

                <p className="text-gray-500 text-sm mt-2">
                  {item.description
                    ? `${item.description.slice(0, 80)}...`
                    : "No description available"}
                </p>

                <p className="text-sm font-medium text-red-500 mt-3">
                  BDT {Number(item.price).toFixed(2)}
                </p>

              </div>

              {/* ================= QUANTITY ================= */}
              <div className="flex items-center border rounded-lg bg-white">

                {/* MINUS */}
                <button
                  type="button"
                  onClick={() =>
                    handleDecreaseQuantity(item)
                  }
                  disabled={Number(item.quantity) <= 1}
                  className={`px-4 py-3 ${
                    Number(item.quantity) <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <FaMinus size={12} />
                </button>

                {/* QUANTITY */}
                <span className="px-4 text-sm font-medium">
                  {item.quantity}
                </span>

                {/* PLUS */}
                <button
                  type="button"
                  onClick={() =>
                    handleIncreaseQuantity(item)
                  }
                  disabled={
                    Number(item.stock) > 0 &&
                    Number(item.quantity) >= Number(item.stock)
                  }
                  className={`px-4 py-3 ${
                    Number(item.stock) > 0 &&
                    Number(item.quantity) >= Number(item.stock)
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <FaPlus size={12} />
                </button>

              </div>

              {/* ================= REMOVE ================= */}
              <button
                type="button"
                onClick={() =>
                  dispatch(removeFromCart(item.id))
                }
                className="text-red-500 hover:text-red-700 p-3"
              >
                <FaTrash size={16} />
              </button>

            </div>
          ))}

          {/* ================= COUPON ================= */}
          <div className="bg-white shadow rounded-xl p-5">

            <h2 className="text-base font-medium mb-4">
              Apply Coupon
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                value={coupon}
                onChange={(e) =>
                  setCouponInput(e.target.value)
                }
                placeholder="Enter coupon code"
                className="border rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-red-300"
              />

              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
              >
                Apply Coupon
              </button>

            </div>

            {couponCode && (
              <p className="text-green-600 text-sm mt-3">
                Applied Coupon: {couponCode}
                {" "}({discountPercent}% OFF)
              </p>
            )}

          </div>

        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div>

          <div className="bg-white shadow rounded-xl p-6 sticky top-5">

            <h2 className="text-lg font-semibold border-b pb-4">
              Order Summary
            </h2>

            {/* TOTAL PRODUCTS */}
            <div className="flex justify-between mt-5">

              <span>Total Products</span>

              <span>
                {totalQuantity}
              </span>

            </div>

            {/* SUBTOTAL */}
            <div className="flex justify-between mt-4">

              <span>Subtotal</span>

              <span>
                BDT {subtotal.toFixed(2)}
              </span>

            </div>

            {/* DISCOUNT */}
            {discount > 0 && (

              <div className="flex justify-between mt-4 text-green-600">

                <span>
                  Discount ({discountPercent}%)
                </span>

                <span>
                  - BDT {discount.toFixed(2)}
                </span>

              </div>

            )}

            {/* SHIPPING */}
            <div className="flex justify-between mt-4">

              <span>Shipping</span>

              <span>
                BDT {shipping.toFixed(2)}
              </span>

            </div>

            {/* TOTAL */}
            <div className="border-t mt-5 pt-5 flex justify-between font-semibold text-lg">

              <span>Total</span>

              <span>
                BDT {total.toFixed(2)}
              </span>

            </div>

            {/* CHECKOUT */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
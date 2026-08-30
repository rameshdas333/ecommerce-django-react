import { createSlice } from "@reduxjs/toolkit";

const savedCart = localStorage.getItem("cartItems");

const initialState = {
  cartItems: savedCart ? JSON.parse(savedCart) : [],
  couponCode: "",
  discountPercent: 0,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ================= ADD TO CART =================
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    // ================= REMOVE =================
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    // ================= UPDATE QUANTITY =================
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.cartItems.find(
        (item) => item.id === id
      );

      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== id
          );
        } else {
          item.quantity = quantity;
        }
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    // ================= SET COUPON =================
    setCoupon: (state, action) => {
      state.couponCode = action.payload.couponCode;
      state.discountPercent = action.payload.discountPercent;
    },

    // ================= CLEAR COUPON =================
    clearCoupon: (state) => {
      state.couponCode = "";
      state.discountPercent = 0;
    },

    // ================= CLEAR CART =================
    clearCart: (state) => {
      state.cartItems = [];
      state.couponCode = "";
      state.discountPercent = 0;

      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCoupon,
  clearCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
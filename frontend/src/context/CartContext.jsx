// import { createContext, useState, useContext } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//    const [cartItems, setCartItems] = useState([]);
//    const addToCart = (product, quantity) => {
//    const existing = cartItems.find((item) => item.id === product.id);
//    if (existing) {
//       setCartItems(
//          cartItems.map((item) =>
//             item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//          )
//       );
//    } else {
//       setCartItems([...cartItems, { ...product, quantity: 1 }]);
//    }
// }}

// // remove Product from cart
// const removeFromCart = (id) => {
//    setCartItems(cartItems.filter((item) => item.id !== id));
// }

// // update quantity
// const updateQuantity = (id, quantity) => {
//     if (quantity < 1) return;
//    setCartItems(
//       cartItems.map((item) =>
//          item.id === id ? { ...item, quantity } : item
//       )
//    );
// };

// return (
//    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
//       {children}
//    </CartContext.Provider>
// );

// export const useCart = () => {
//    return useContext(CartContext);
// }

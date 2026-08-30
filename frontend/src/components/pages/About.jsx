// import { useSelector, useDispatch } from "react-redux";
// import { addToCart } from "../../redux/slices/cartSlice.js";

// const About = () => {
//   const dispatch = useDispatch();

//   const cartItems = useSelector(
//     (state) => state.cart.cartItems
//   );

//   const product = {
//     id: 1,
//     name: "Test Product",
//     price: 100,
//   };

//   return (
//     <div>
//       <p>Cart Items: {cartItems.length}</p>

//       <button
//         onClick={() =>
//           dispatch(
//             addToCart({
//               product,
//               quantity: 1,
//             })
//           )
//         }
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default About;
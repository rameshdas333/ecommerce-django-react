// // import React from 'react'
// // import {Link, NavLink} from 'react-router-dom'
// // import logo from '../../assets/logo.png'


// // const Navbar = () => {

// //   const menuItems = (
// //    <>
// //   <li className='font-semibold'>
// //     <NavLink to='/'>Home</NavLink>
    
// //   </li>
// //   <li className='font-semibold'>
// //     <NavLink to='/products'>Products</NavLink>
    
// //   </li>
// //   <li className='font-semibold'>

// //     <NavLink to='/about'>About</NavLink>
// //   </li>
// //   <li className='font-semibold'>
// //     <NavLink to='/contact'>Contact</NavLink>
// //   </li>

 
 
// //   </>
// //   )
// //   return (
// //   <div className="navbar bg-base-100 shadow-sm">
// //   <div className="navbar-start">
// //     <div className="dropdown">
// //       <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
// //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
// //       </div>
// //       <ul
// //         tabIndex="-1"
// //         className="menu menu-sm dropdown-content  bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
// //      {menuItems}
// //       </ul>
// //     </div>
   
// //       <Link to="/">
// //       <img width="80" className="rounded-lg" src={logo} alt="" />
// //       </Link>
    
// //   </div>
// //   <div className="navbar-center hidden lg:flex">
// //     <ul className="menu menu-horizontal px-1">

// //      {/* Menu Bar */}
// //      {menuItems}
// //     </ul>
// //   </div>
// //  <input type="search" name="search"  className="bg-amber-800" id="" />
// //   <div className="navbar-end">
// //     <a className="btn">Button</a>
// //   </div>
// // </div>
// //   )
// // }

// // export default Navbar






// import React from "react";
// import { Link, NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { MdOutlineShoppingCart } from "react-icons/md";

// import logo from "../../assets/logo.png";

// const Navbar = () => {
//   // Redux from Cart Items 
//   const cartItems = useSelector(
//     (state) => state.cart.cartItems
//   );

//   //all  product total quantity
//   const cartCount = cartItems.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   const menuItems = (
//     <>
//       <li className="font-semibold">
//         <NavLink to="/">Home</NavLink>
//       </li>

//       <li className="font-semibold">
//         <NavLink to="/products">Products</NavLink>
//       </li>

//       <li className="font-semibold">
//         <NavLink to="/about">About</NavLink>
//       </li>

//       <li className="font-semibold">
//         <NavLink to="/contact">Contact</NavLink>
//       </li>

//       <li className="font-semibold">
//         <NavLink to="/register">Sign Up</NavLink>
//       </li>
//     </>
//   );

//   return (
//     <div className="navbar sticky top-0 z-50 bg-[#CDE4EA]  w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16  shadow-sm">
      
//       {/* Navbar Start */}
//       <div className="navbar-start">
//         <div className="dropdown">
//           <div
//             tabIndex={0}
//             role="button"
//             className="btn btn-ghost lg:hidden"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h8m-8 6h16"
//               />
//             </svg>
//           </div>

//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
//           >
//             {menuItems}
//           </ul>
//         </div>

//         {/* Logo */}
//         <Link to="/">
//           <img
//             width="80"
//             className="rounded-lg"
//             src={logo}
//             alt="Logo"
//           />
//         </Link>
//       </div>

//       {/* Navbar Center */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1">
//           {menuItems}
//         </ul>
//       </div>

//       {/* Search */}
//       <input
//         type="search"
//         name="search"
//         placeholder="Search..."
//         className="input input-bordered hidden md:block"
//       />

//       {/* Navbar End */}
//       <div className="navbar-end">
        
//         {/* Cart */}
//         <Link to="/cart" className="btn btn-ghost  btn-circle relative">
//           <MdOutlineShoppingCart className="text-3xl" />

//           {/* Cart Count */}
//           {cartCount > 0 && (
//             <span className="badge text-white bg-[#FB2C36] badge-sm absolute -top-1 -right-1">
//               {cartCount}
//             </span>
//           )}
//         </Link>

//       </div>
//     </div>
//   );
// };

// export default Navbar;


// ============================================


import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdOutlineShoppingCart,
  MdSearch,
} from "react-icons/md";

import logo from "../../assets/logo.png";

const Navbar = () => {
  // Redux from Cart Items
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  // All product total quantity
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Search state
  const [search, setSearch] = useState("");

  // Navigate
  const navigate = useNavigate();

  // Search function
  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (searchValue) {
      navigate(
        `/products?search=${encodeURIComponent(searchValue)}`
      );
    } else {
      navigate("/products");
    }
  };

  const menuItems = (
    <>
      <li className="font-semibold">
        <NavLink to="/">Home</NavLink>
      </li>

      <li className="font-semibold">
        <NavLink to="/products">Products</NavLink>
      </li>

      <li className="font-semibold">
        <NavLink to="/about">About</NavLink>
      </li>

      <li className="font-semibold">
        <NavLink to="/contact">Contact</NavLink>
      </li>

      <li className="font-semibold">
        <NavLink to="/register">Sign Up</NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar sticky top-0 z-50 bg-[#CDE4EA] w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 shadow-sm">

      {/* Navbar Start */}
      <div className="navbar-start">

        {/* Mobile Menu */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {menuItems}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/">
          <img
            width="80"
            className="rounded-lg"
            src={logo}
            alt="Logo"
          />
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center mr-2"
        >
          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="input input-bordered w-40 lg:w-52"
          />

          <button
            type="submit"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
          >
            <MdSearch className="text-2xl" />
          </button>
        </form>

        {/* Cart */}
        <Link
          to="/cart"
          className="btn btn-ghost btn-circle relative"
        >
          <MdOutlineShoppingCart className="text-3xl" />

          {/* Cart Count */}
          {cartCount > 0 && (
            <span className="badge text-white bg-[#FB2C36] badge-sm absolute -top-1 -right-1">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </div>
  );
};

export default Navbar;





import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import { FiUser } from "react-icons/fi";
import {
  MdOutlineShoppingCart,
  MdSearch,
} from "react-icons/md";

import logo from "../../assets/logo.png";

const Navbar = () => {

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
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
    <div className="navbar sticky top-0 z-50 bg-white w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 shadow-sm">

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
            src={logo}
            alt="Logo"
            className="w-14 sm:w-16 md:w-18 lg:w-20 h-auto rounded-lg object-contain"
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
            className="input input-bordered w-60 lg:w-70"
          />

          <button
            type="submit"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
          >
            <MdSearch className="text-2xl" />
          </button>
        </form>

        {/* Cart & Login */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle"
                aria-label="User menu"
              >
                <FiUser className="text-3xl" />
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 mt-3 w-40 p-2 shadow-lg border border-gray-100"
              >
                <li>
                  <Link to="/profile">
                    Profile
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-ghost btn-circle"
              aria-label="Login"
            >
              <FiUser className="text-3xl" />
            </Link>
          )}
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
    </div>
  );
};

export default Navbar;


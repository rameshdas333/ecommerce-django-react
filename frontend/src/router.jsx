import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import Home from "./components/pages/Home/Home.jsx";
import ProductList from "./components/pages/ProductList.jsx";
import ProductDetails from "./components/pages/ProductDetails.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Cart from "./components/pages/Cart.jsx";
import Checkout from "./components/pages/Checkout.jsx";

import AuthLayout from "./components/authLayout/AuthLayout.jsx";
import Login from "./components/authLayout/Login.jsx";
import Register from "./components/authLayout/Register.jsx";
import Profile from "./components/authLayout/Profile.jsx";
import ForgotPassword from "./components/authLayout/ForgotPassword.jsx";
import ResetPassword from "./components/authLayout/ResetPassword.jsx";

import About from "./components/pages/about/About.jsx";
import Contact from "./components/pages/contact/Contact.jsx";

// ================= ADMIN =================
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/Pages/AdminDashboard.jsx";
import AdminProducts from "./admin/Pages/AdminProducts.jsx";
import Analytics from "./admin/Pages/Analytics.jsx";
import Inventory from "./admin/Pages/AdminInventory.jsx";
import Orders from "./admin/Pages/Orders.jsx";
import Sales from "./admin/Pages/Sales.jsx";
import Customers from "./admin/Pages/Customers.jsx";
import Newsletter from "./admin/Pages/Newsletter.jsx";
import Settings from "./admin/Pages/Settings.jsx";
import Categories from "./admin/Pages/AdminCategory.jsx";



const router = createBrowserRouter([
  
  // =====================================================
  // CUSTOMER WEBSITE
  // =====================================================

  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,

    children: [

      {
        index: true,
        element: <Home />,
      },

      {
        path: "products",
        element: <ProductList />,
      },

      {
        path: "products/:id",
        element: <ProductDetails />,
      },

      {
        path: "about",
        element: <About />,
      },
      {
         path: "contact",
         element: <Contact />,
      },

      {
        path: "cart",
        element: <Cart />,
      },

      {
        path: "checkout",
        element: <Checkout />,
      },

      // ================= AUTH =================

      {
        path: "/",
        element: <AuthLayout />,

        children: [
          {
            path: "login",
            element: <Login />,
          },

          {
            path: "register",
            element: <Register />,
          },
          {
            path: "profile",
            element: <Profile />,

          },

          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },

          {
            path: "reset-password/:uid/:token",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },


  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,

    children: [

      // Dashboard
      {
        index: true,
        element: <AdminDashboard />,
      },

      // Analytics
      {
        path: "analytics",
        element: <Analytics />,
      },

      {
        path: "categories",
        element: <Categories/>

      },

      // Products
      {
        path: "products",
        element: <AdminProducts />,
      },

      // Inventory
      {
        path: "inventory",
        element: <Inventory />,
      },

      // Orders
      {
        path: "orders",
        element: <Orders />,
      },

      // Sales
      {
        path: "sales",
        element: <Sales />,
      },

      // Customers
      {
        path: "customers",
        element: <Customers />,
      },

      // Newsletter
      {
        path: "newsletter",
        element: <Newsletter />,
      },

      // Settings
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

]);

export default router;
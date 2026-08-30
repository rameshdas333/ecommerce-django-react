import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import ProductList from "./components/pages/ProductList.jsx";
import ProductDetails from "./components/pages/ProductDetails.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Cart from "./components/pages/Cart.jsx";
import Checkout from "./components/pages/Checkout.jsx";
import AuthLayout from "./components/authLayout/AuthLayout.jsx";
import Login from "./components/authLayout/Login.jsx";
import Register from "./components/authLayout/Register.jsx";
import ForgotPassword from "./components/authLayout/ForgotPassword.jsx";
import ResetPassword from "./components/authLayout/ResetPassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    errorElement: <ErrorPage />,
    children:[
        {
            index: true,
            element: <Home></Home>

        },
        {
            path:"products",
            element:<ProductList></ProductList>

        },
        {
            path:"products/:id",
            element:<ProductDetails></ProductDetails>

        },

        {
            path: "cart",
            element: <Cart />,
        },

        {
            path: "checkout",
            element: <Checkout />,
        },
        {
            path:"/",
            Component:AuthLayout,
            children:[
                {
                    path: "login",
                    element: <Login />
                },
                {
                    path: "register",
                    element: <Register />
                },
                {
                    path: "/forgot-password",
                    element: <ForgotPassword />
                },
                {
                    path: "/reset-password/:uid/:token",
                    element: <ResetPassword />
                }
            ]
        }
           
    ]
  },

 
]);

export default router;
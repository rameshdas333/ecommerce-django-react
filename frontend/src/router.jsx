import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./components/pages/Home.jsx";
import ProductList from "./components/pages/ProductList.jsx";
import ProductDetails from "./components/pages/ProductDetails.jsx";
import ErrorPage from "./components/ErrorPage.jsx";


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
       
    ]
  },

 
]);

export default router;
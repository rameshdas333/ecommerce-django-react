import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import router from "./router.jsx";
import { store } from "./redux/store.js";
// import { CartProvider } from "./context/CartContext.jsx";
const GOOGLE_CLIENT_ID =
  "453299031822-tcsu6vhan0t6o9dv66k0etrh860c8cp0.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>   
    <Provider store={store}>
      <RouterProvider router={router} />
         <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);

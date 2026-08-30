import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "./index.css";
import router from "./router.jsx";
import { store } from "./redux/store.js";
// import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
         <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </Provider>
  </StrictMode>
);

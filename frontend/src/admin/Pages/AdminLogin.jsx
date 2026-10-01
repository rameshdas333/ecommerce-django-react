import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login/`,
        {
          email,
          password,
        }
      );

      const user = response.data?.user;

      // =========================
      // CHECK ADMIN
      // =========================
      if (
        user?.is_staff !== true &&
        user?.is_superuser !== true
      ) {
        toast.error("Only admin can access this page!");
        return;
      }

      // =========================
      // SAVE LOGIN DATA
      // =========================
      localStorage.setItem(
        "accessToken",
        response.data.access
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success("Admin login successful!");

      // Admin Dashboard
      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.detail ||
          "Invalid admin email or password!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f7] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to access the SmartBazar Admin Panel
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAdminLogin}>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="
                w-full
                border
                border-gray-300
                rounded-md
                px-4
                py-3
                text-sm
                outline-none
                focus:border-[#31b89b]
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-md
                  px-4
                  py-3
                  pr-12
                  text-sm
                  outline-none
                  focus:border-[#31b89b]
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-[#31b89b]
                "
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="
              w-full
              bg-[#31b89b]
              text-white
              py-3
              rounded-md
              font-medium
              transition
              hover:bg-[#279f88]
            "
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
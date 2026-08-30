import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
const [showPassword, setShowPassword] = useState(false);

// Backend data states
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

// Login function
const handleLogin = async (e) => {
e.preventDefault();


console.log("EMAIL:", email);
console.log("PASSWORD:", password);

try {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/auth/login/",
    {
      email,
      password,
    }
  );

  console.log("LOGIN SUCCESS:", response.data);

  localStorage.setItem("accessToken", response.data.access);
  localStorage.setItem("refreshToken", response.data.refresh);

  toast.success("Login successful!");

  navigate("/");

} catch (error) {
  console.log("LOGIN ERROR:", error);
  console.log("RESPONSE DATA:", error.response?.data);

  toast.error(
    error.response?.data?.detail ||
    JSON.stringify(error.response?.data) ||
    error.message ||
    "Login failed!"
  );
}


};

return ( <div className="w-full">
{/* TITLE */} <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl lg:text-4xl">
Log in to Exclusive </h1>


  <p className="mt-2 mb-7 text-sm text-black sm:mb-10 sm:text-base">
    Enter your details below
  </p>

  {/* onSubmit added */}
  <form onSubmit={handleLogin} className="w-full">

    {/* EMAIL / USERNAME */}
    <div className="mb-5 sm:mb-6">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="
          w-full border-b border-gray-300 bg-transparent
          py-3 text-sm outline-none transition
          focus:border-[#DB4444] sm:text-base
        "
      />
    </div>

    {/* PASSWORD */}
    <div className="relative mb-7">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="
          w-full border-b border-gray-300 bg-transparent
          py-3 pr-10 text-sm outline-none transition
          focus:border-[#DB4444] sm:text-base
        "
      />

      {/* EYE BUTTON */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute right-2 top-1/2
          -translate-y-1/2
          cursor-pointer
          text-gray-500
          hover:text-[#DB4444]
        "
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

    {/* LOGIN + FORGET PASSWORD */}
    <div className="flex items-center justify-between gap-3">
      <button
        type="submit"
        className="
          cursor-pointer rounded-sm bg-[#DB4444]
          px-6 py-3 text-sm text-white
          transition duration-300 hover:bg-red-600
          sm:px-10 sm:py-3.5 sm:text-base
        "
      >
        Log in
      </button>

      <Link
        to="/forgot-password"
        className="
          whitespace-nowrap text-sm text-[#DB4444]
          transition hover:underline sm:text-base
        "
      >
        Forget Password?
      </Link>
    </div>

    {/* GOOGLE BUTTON */}
    <button
      type="button"
      className="
        mt-5 flex w-full items-center justify-center gap-3
        rounded-sm border border-gray-300
        py-3 text-sm transition duration-300
        hover:bg-gray-50
        sm:py-3.5 sm:text-base
      "
    >
      <FcGoogle className="text-xl sm:text-2xl" />
      <span>Login with Google</span>
    </button>
  </form>

  {/* REGISTER LINK */}
  <p className="mt-6 text-center text-sm text-gray-600 sm:text-base">
    Don't have an account?{" "}
    <Link
      to="/register"
      className="text-blue-400 underline underline-offset-4"
    >
      Create Account
    </Link>
  </p>
</div>


);
};

export default Login;

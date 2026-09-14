



// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Register = () => {
// const [showPassword, setShowPassword] = useState(false);

// // Backend data states
// const [name, setName] = useState("");
// const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");

// const navigate = useNavigate();

// // Register function
// const handleRegister = async (e) => {
//   e.preventDefault();

//   // Password minimum 6 characters
//   if (password.length < 6) {
//     toast.error("Password must be at least 6 characters!");
//     return;
//   }

//   // Strong password validation
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!,./])[A-Za-z\d@#!,./]{6,}$/;

//   if (!passwordRegex.test(password)) {
//     toast.error(
//       "Password must contain uppercase, lowercase, number and special character!"
//     );
//     return;
//   }

//   //  API call 
//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:8000/api/auth/register/",
//       {
//         name: name,
//         email: email,
//         password: password,
//       }
//     );

//     console.log("SUCCESS:", response.data);

//     toast.success("Registration successful!");

//     navigate("/login");

//   } catch (error) {
//     console.error("REGISTER ERROR:", error);

//     if (error.response) {
//       console.log("STATUS:", error.response.status);
//       console.log("DATA:", error.response.data);

//       toast.error(JSON.stringify(error.response.data));
//     } else {
//       toast.error("Server connection failed: " + error.message);
//     }
//   }
// };

// return ( <div className="w-full">


//   {/* TITLE */}
//   <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
//     Create an account
//   </h1>

//   <p className="text-sm sm:text-base text-gray-600 mt-2 mb-7 sm:mb-10">
//     Enter your details below
//   </p>

//   {/* onSubmit ++ */}
//   <form onSubmit={handleRegister} className="w-full">

//     {/* NAME */}
//     <div className="mb-5 sm:mb-6">
//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//         className="
//           w-full border-b border-gray-300 bg-transparent
//           py-3 text-sm sm:text-base outline-none
//           focus:border-[#DB4444]
//         "
//       />
//     </div>

//     {/* EMAIL */}
//     <div className="mb-5 sm:mb-6">
//       <input
//         type="email"
//         placeholder="Email or Phone number"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         className="
//           w-full border-b border-gray-300 bg-transparent
//           py-3 text-sm sm:text-base outline-none
//           focus:border-[#DB4444]
//         "
//       />
//     </div>

//     {/* PASSWORD + EYE BUTTON */}
//     <div className="relative mb-7">
//       <input
//         type={showPassword ? "text" : "password"}
//         placeholder="Password (minimum 6 characters)"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//         minLength={6}
//         className="
//           w-full border-b border-gray-300 bg-transparent
//           py-3 pr-10 text-sm sm:text-base outline-none
//           transition focus:border-[#DB4444]
//         "
//       />

//       <button
//         type="button"
//         onClick={() => setShowPassword(!showPassword)}
//         className="
//           absolute right-2 top-1/2
//           -translate-y-1/2
//           cursor-pointer text-gray-500
//           transition hover:text-[#DB4444]
//         "
//       >
//         {showPassword ? <FaEyeSlash /> : <FaEye />}
//       </button>
//     </div>

//     {/* REGISTER BUTTON */}
//     <button
//       type="submit"
//       className="
//         w-full cursor-pointer
//         bg-[#DB4444] hover:bg-red-600
//         text-white py-3 sm:py-3.5
//         text-sm sm:text-base
//         rounded-sm transition duration-300
//       "
//     >
//       Create Account
//     </button>

//     {/* GOOGLE BUTTON */}
//     <button
//       type="button"
//       className="
//         w-full mt-4 border border-gray-300
//         hover:bg-gray-50 py-3 sm:py-3.5
//         flex items-center justify-center gap-3
//         text-sm sm:text-base rounded-sm
//         transition duration-300 cursor-pointer
//       "
//     >
//       <FcGoogle className="text-xl sm:text-2xl" />

//       <span>Sign up with Google</span>
//     </button>

//   </form>

//   {/* LOGIN LINK */}
//   <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
//     Already have account?{" "}

//     <Link
//       to="/login"
//       className="text-blue-400 underline underline-offset-4"
//     >
//       Login
//     </Link>
//   </p>

// </div>


// );
// };

// export default Register;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Backend data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // =========================
  // NORMAL REGISTER
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password minimum 6 characters
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    // Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!,./])[A-Za-z\d@#!,./]{6,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character!"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      console.log("REGISTER SUCCESS:", response.data);

      toast.success("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);

        toast.error(
          error.response.data?.detail ||
            JSON.stringify(error.response.data) ||
            "Registration failed!"
        );
      } else {
        toast.error("Server connection failed: " + error.message);
      }
    }
  };

  // =========================
  // GOOGLE REGISTER
  // =========================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("GOOGLE CREDENTIAL:", credentialResponse);

      if (!credentialResponse?.credential) {
        toast.error("Google credential not found!");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/google/",
        {
          credential: credentialResponse.credential,
        }
      );

      console.log("GOOGLE REGISTER SUCCESS:", response.data);

      // Save JWT tokens
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      toast.success("Google registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("GOOGLE REGISTER ERROR:", error);

      console.log("GOOGLE ERROR RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "Google registration failed!"
      );
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    toast.error("Google registration failed!");
  };

  return (
    <div className="w-full">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
        Create an account
      </h1>

      <p className="text-sm sm:text-base text-gray-600 mt-2 mb-7 sm:mb-10">
        Enter your details below
      </p>

      <form onSubmit={handleRegister} className="w-full">

        {/* NAME */}
        <div className="mb-5 sm:mb-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="
              w-full border-b border-gray-300 bg-transparent
              py-3 text-sm sm:text-base outline-none
              focus:border-[#DB4444]
            "
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5 sm:mb-6">
          <input
            type="email"
            placeholder="Email or Phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full border-b border-gray-300 bg-transparent
              py-3 text-sm sm:text-base outline-none
              focus:border-[#DB4444]
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-7">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="
              w-full border-b border-gray-300 bg-transparent
              py-3 pr-10 text-sm sm:text-base outline-none
              transition focus:border-[#DB4444]
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-2 top-1/2
              -translate-y-1/2
              cursor-pointer text-gray-500
              transition hover:text-[#DB4444]
            "
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* REGISTER BUTTON */}
        {/* DESIGN UNCHANGED */}
        <button
          type="submit"
          className="
            w-full cursor-pointer 
            bg-[#DB4444] hover:bg-red-600 
            text-white py-3 sm:py-3.5 
            text-sm sm:text-base 
            rounded-sm transition duration-300 
          "
        >
          Create Account
        </button>

        {/* GOOGLE BUTTON */}
        <div className="relative mt-4">

          {/* YOUR ORIGINAL BUTTON */}
          <button
            type="button"
            className="
              w-full border border-gray-300 
              hover:bg-gray-50 py-3 sm:py-3.5 
              flex items-center justify-center gap-3 
              text-sm sm:text-base rounded-sm 
              transition duration-300 cursor-pointer
            "
          >
            <FcGoogle className="text-xl sm:text-2xl" />

            <span>Sign up with Google</span>
          </button>

          {/* GOOGLE OFFICIAL BUTTON OVERLAY */}
          <div
            className="
              absolute inset-0
              opacity-0
              overflow-hidden
            "
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
            />
          </div>

        </div>
      </form>

      {/* LOGIN LINK */}
      <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
        Already have account?{" "}

        <Link
          to="/login"
          className="text-blue-400 underline underline-offset-4"
        >
          Login
        </Link>
      </p>

    </div>
  );
};

export default Register;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
const [email, setEmail] = useState("");
const navigate = useNavigate();

const handleForgotPassword = async (e) => {
e.preventDefault();


try {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/auth/forgot-password/",
    { email }
  );

  console.log("SUCCESS:", response.data);

  toast.success(response.data.message);


  console.log("RESET LINK:", response.data.reset_link);

  navigate("/login");

} catch (error) {
  console.error("FORGOT PASSWORD ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);

  toast.error(
    error.response?.data?.error ||
    error.response?.data?.detail ||
    error.message ||
    "Something went wrong!"
  );
}
};

return ( <div className="max-w-md mx-auto mt-10 p-6"> <h1 className="text-2xl font-bold">
Forgot Password </h1>


  <p className="mt-2 text-gray-500">
    Enter your email to reset your password
  </p>

  <form onSubmit={handleForgotPassword} className="mt-6">
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full border p-3 rounded"
    />

    <button
      type="submit"
      className="w-full bg-[#DB4444] text-white p-3 mt-4 rounded"
    >
      Send Reset Link
    </button>
  </form>
</div>


);
};

export default ForgotPassword;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
const { uid, token } = useParams();

const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const navigate = useNavigate();

const handleResetPassword = async (e) => {
e.preventDefault();


// Password minimum 6 characters
if (newPassword.length < 6) {
  toast.error("Password must be at least 6 characters!");
  return;
}

// Password match check
if (newPassword !== confirmPassword) {
  toast.error("Passwords do not match!");
  return;
}

try {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/auth/reset-password/",
    {
      uid: uid,
      token: token,
      new_password: newPassword,
    }
  );

  toast.success(response.data.message);

  // Login page
  navigate("/login");

} catch (error) {
  console.error("RESET PASSWORD ERROR:", error);

  toast.error(
    error.response?.data?.error ||
    "Password reset failed!"
  );
}


};

return ( <div className="max-w-md mx-auto mt-10 p-6"> <h1 className="text-2xl font-bold">
Reset Password </h1>


  <form
    onSubmit={handleResetPassword}
    className="mt-6"
  >
    {/* NEW PASSWORD */}
    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
      minLength={6}
      className="w-full border p-3 rounded"
    />

    {/* CONFIRM PASSWORD */}
    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(e.target.value)
      }
      required
      minLength={6}
      className="w-full border p-3 rounded mt-4"
    />

    <button
      type="submit"
      className="
        w-full mt-4 bg-[#DB4444]
        text-white p-3 rounded
      "
    >
      Reset Password
    </button>
  </form>
</div>

);
};

export default ResetPassword;

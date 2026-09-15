import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../../redux/slices/authSlice.js";

const Profile = () => {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage your account and orders
          </p>
        </div>

        {/* ================= ACCOUNT INFORMATION ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">

          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Account Information
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your personal account details
              </p>
            </div>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <FiUser className="text-red-500 text-lg sm:text-xl" />
            </div>
          </div>

          {/* Information */}
          <div className="space-y-0">

            {/* Full Name */}
            <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-gray-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FiUser className="text-red-500 text-base sm:text-lg" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">
                  Full Name
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-800 mt-1 truncate">
                  {user?.name || user?.username || "Not available"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-gray-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FiMail className="text-red-500 text-base sm:text-lg" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">
                  Email Address
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-800 mt-1 break-all">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-gray-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FiPhone className="text-red-500 text-base sm:text-lg" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">
                  Phone Number
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-800 mt-1">
                  {user?.phone || "Not added"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 sm:gap-4 py-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FiMapPin className="text-red-500 text-base sm:text-lg" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">
                  Address
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-800 mt-1 break-words">
                  {user?.address || "Not added"}
                </p>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>

        </div>

      

      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiCalendar,
  FiBell,
  FiMessageCircle,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000";

const AdminNavbar = ({ setSidebarOpen }) => {
  const [adminLogo, setAdminLogo] = useState(null);

  // ================= LOAD ADMIN LOGO =================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/settings/`
        );

        const logoPath = response.data?.admin_logo;

        if (logoPath) {
          setAdminLogo(
            logoPath.startsWith("http")
              ? logoPath
              : `${API_URL}${logoPath}`
          );
        }
      } catch (error) {
        console.error(
          "Failed to load admin logo:",
          error.response?.data || error
        );
      }
    };

    fetchSettings();
  }, []);

  return (
    <header
      className="
        fixed
        top-0
        right-0
        left-0
        md:left-[170px]
        z-40
        h-[72px]
        bg-[#f5f7f7]
        border-b
        border-gray-200
      "
    >
      <div
        className="
          h-full
          flex
          items-center
          justify-between
          gap-3
          px-4
          sm:px-5
        "
      >
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              md:hidden
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-md
              bg-white
              border
              border-gray-200
              text-gray-600
              hover:bg-gray-50
            "
          >
            <FiMenu size={19} />
          </button>

          <div>
            <h1
              className="
                text-[18px]
                sm:text-[20px]
                font-semibold
                text-gray-800
              "
            >
              Overview
            </h1>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div
          className="
            hidden
            sm:block
            flex-1
            max-w-[420px]
            mx-2
            lg:mx-8
          "
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                h-[42px]
                bg-white
                border
                border-gray-200
                rounded-md
                pl-4
                pr-10
                text-sm
                outline-none
                focus:border-[#5fd6bd]
              "
            />

            <FiSearch
              size={18}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Date */}
          <button
            className="
              hidden
              md:flex
              h-[42px]
              px-3
              bg-white
              border
              border-gray-200
              rounded-md
              items-center
              gap-2
              text-sm
              text-gray-600
            "
          >
            <FiCalendar size={16} />

            <span>30 May</span>
          </button>

          {/* Notification */}
          <button
            className="
              relative
              w-[38px]
              h-[38px]
              sm:w-[42px]
              sm:h-[42px]
              bg-white
              border
              border-gray-200
              rounded-md
              flex
              items-center
              justify-center
              text-gray-600
            "
          >
            <FiBell size={18} />

            <span
              className="
                absolute
                top-2
                right-2
                w-2
                h-2
                bg-red-500
                rounded-full
              "
            />
          </button>

          {/* Message */}
          <button
            className="
              hidden
              sm:flex
              w-[38px]
              h-[38px]
              sm:w-[42px]
              sm:h-[42px]
              bg-white
              border
              border-gray-200
              rounded-md
              items-center
              justify-center
              text-gray-600
            "
          >
            <FiMessageCircle size={18} />
          </button>

          {/* Profile */}
          <button
            className="
              flex
              items-center
              gap-2
              ml-1
              sm:ml-2
            "
          >
            {adminLogo ? (
              <img
                src={adminLogo}
                alt="Admin Logo"
                className="
                  w-9
                  h-9
                  rounded-full
                  object-cover
                  shrink-0
                "
              />
            ) : (
              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#dcefeb]
                  flex
                  items-center
                  justify-center
                  text-[#31b89b]
                  font-semibold
                  shrink-0
                "
              >
                A
              </div>
            )}

            {/* Profile text only desktop */}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>

            <FiChevronDown
              size={16}
              className="text-gray-400 hidden sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
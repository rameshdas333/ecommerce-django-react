
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const API_URL = (
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [sidebarLogo, setSidebarLogo] = useState(null);

  // =====================================================
  // IMAGE URL
  // =====================================================
  const getImageUrl = (value) => {
    if (!value) return null;

    const stringValue = String(value);

    if (
      stringValue.startsWith("http://") ||
      stringValue.startsWith("https://") ||
      stringValue.startsWith("blob:")
    ) {
      return stringValue;
    }

    if (stringValue.startsWith("/")) {
      return `${API_URL}${stringValue}`;
    }

    return `${API_URL}/${stringValue}`;
  };

  // =====================================================
  // UPDATE SIDEBAR LOGO
  // =====================================================
  const updateSidebarLogo = (logoPath) => {
    if (!logoPath) {
      setSidebarLogo(null);
      return;
    }

    const imageUrl = getImageUrl(logoPath);

    if (!imageUrl) {
      setSidebarLogo(null);
      return;
    }

    const finalUrl = `${imageUrl}${
      imageUrl.includes("?") ? "&" : "?"
    }v=${Date.now()}`;

    setSidebarLogo(finalUrl);
  };

  // =====================================================
  // LOAD SIDEBAR LOGO
  // =====================================================
  useEffect(() => {
    const fetchSidebarLogo = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/settings/`
        );

        const data = response.data || {};

        console.log("SIDEBAR LOGO API:", data.sidebar_logo);

        if (data.sidebar_logo) {
          updateSidebarLogo(data.sidebar_logo);

          // Save backend path
          localStorage.setItem(
            "sidebarLogo",
            data.sidebar_logo
          );
        } else {
          setSidebarLogo(null);
          localStorage.removeItem("sidebarLogo");
        }
      } catch (error) {
        console.error(
          "Failed to load sidebar logo:",
          error?.response?.data || error
        );
      }
    };

    // =====================================================
    // FIRST LOAD FROM LOCAL STORAGE
    // =====================================================
    const savedLogo = localStorage.getItem("sidebarLogo");

    if (savedLogo) {
      updateSidebarLogo(savedLogo);
    }

    // =====================================================
    // THEN LOAD FROM BACKEND
    // =====================================================
    fetchSidebarLogo();

    // =====================================================
    // LISTEN FOR BRANDING UPDATE
    // =====================================================
    const handleBrandingUpdated = (event) => {
      console.log(
        "BRANDING UPDATED:",
        event.detail
      );

      const newSidebarLogo =
        event.detail?.sidebar_logo;

      if (newSidebarLogo) {
        localStorage.setItem(
          "sidebarLogo",
          newSidebarLogo
        );

        updateSidebarLogo(newSidebarLogo);
      } else {
        fetchSidebarLogo();
      }
    };

    window.addEventListener(
      "brandingUpdated",
      handleBrandingUpdated
    );

    return () => {
      window.removeEventListener(
        "brandingUpdated",
        handleBrandingUpdated
      );
    };
  }, []);

  // =====================================================
  // MENU
  // =====================================================

 const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
  },
  {
    label: "Products",
    path: "/admin/products",
  },
  {
    label: "categories",
    path: "/admin/categories",
  },
  {
    label: "Inventory",
    path: "/admin/inventory",
  },
  {
    label: "Orders",
    path: "/admin/orders",
  },
  {
    label: "Sales",
    path: "/admin/sales",
  },
  {
    label: "Customers",
    path: "/admin/customers",
  },
  {
    label: "Newsletter",
    path: "/admin/newsletter",
  },
  {
    label: "Settings",
    path: "/admin/settings",
  },
];

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[240px]
          md:w-[170px]
          bg-[#F5F7F7]
          border-r
          border-gray-200
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* =====================================================
            HEADER / LOGO
        ===================================================== */}
        <div className="h-[72px] flex items-center justify-center px-4 border-b border-gray-200">
          <div className="w-[120px] h-[48px] flex items-center justify-center">
            <img
              src={sidebarLogo || logo}
              alt="Sidebar Logo"
              className="w-full h-full object-contain rounded-xl! "
              onError={(e) => {
                console.error(
                  "Sidebar logo failed:",
                  e.currentTarget.src
                );

                e.currentTarget.src = logo;
              }}
            />
          </div>
        </div>

        {/* =====================================================
            MENU
        ===================================================== */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-sm
                font-medium
                transition
                ${
                  isActive
                    ? "bg-[#5fd6bd] text-white"
                    : "text-gray-600 hover:bg-white"
                }
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;


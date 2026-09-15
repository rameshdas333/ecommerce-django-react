import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FiHome,
  FiBarChart2,
  FiBox,
  FiArchive,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiMail,
  FiSettings,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiHome,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: FiBarChart2,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiBox,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: FiArchive,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Sales",
      path: "/admin/sales",
      icon: FiTrendingUp,
    },
    {
      name: "Customer",
      path: "/admin/customers",
      icon: FiUsers,
    },
    {
      name: "Newsletter",
      path: "/admin/newsletter",
      icon: FiMail,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: FiSettings,
    },
  ];

  const handleMenuClick = () => {
    // Mobile এ menu click করলে sidebar বন্ধ হবে
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed
          inset-0
          bg-black/40
          z-[45]
          md:hidden
          transition-opacity
          duration-300
          ${
            sidebarOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[50]
          h-screen
          w-[240px]
          md:w-[170px]
          bg-[#F5F7F7]
          border-r
          border-gray-200
          flex
          flex-col

          transform
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10  flex items-center justify-center shrink-0">
              <img src={logo} className="w-full rounded-lg h-full object-contain"  alt="Logo.png" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[14px] font-bold text-gray-800 leading-tight truncate">
                SmartBazar
              </h2>

              <p className="text-[9px] text-gray-400 truncate">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="
              md:hidden
              w-8
              h-8
              rounded-md
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-100
            "
          >
            <FiX size={19} />
          </button>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 px-3 mb-3">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={handleMenuClick}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    items-center
                    justify-between
                    w-full
                    px-3
                    text-black!
                    py-2.5
                    rounded-md
                    text-[12px]
                    transition-all

                    ${
                      isActive
                        ? "bg-[#5fd6bd] text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={16} className="shrink-0" />

                        <span className="truncate">
                          {item.name}
                        </span>
                      </div>

                      {isActive && (
                        <span className="text-sm shrink-0">
                          ›
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
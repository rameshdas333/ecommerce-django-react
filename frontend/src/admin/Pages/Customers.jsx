
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customers = () => {
  const BASEURL =
    import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // =========================================================
  // TOAST STYLE
  // =========================================================

  const bigToastStyle = {
    fontSize: "17px",
    fontWeight: "600",
    padding: "18px 22px",
    borderRadius: "12px",
    width: "min(390px, calc(100vw - 24px))",
  };

  // =========================================================
  // GET ACCESS TOKEN
  // =========================================================

  const getAccessToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("access") ||
      null
    );
  };

  // =========================================================
  // GET REFRESH TOKEN
  // =========================================================

  const getRefreshToken = () => {
    return (
      localStorage.getItem("refreshToken") ||
      localStorage.getItem("refresh_token") ||
      localStorage.getItem("refresh") ||
      null
    );
  };

  // =========================================================
  // SAVE ACCESS TOKEN
  // =========================================================

  const saveAccessToken = (token) => {
    if (!token) return;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("access_token", token);
  };

  // =========================================================
  // SAVE REFRESH TOKEN
  // =========================================================

  const saveRefreshToken = (token) => {
    if (!token) return;

    localStorage.setItem("refreshToken", token);
    localStorage.setItem("refresh_token", token);
  };

  // =========================================================
  // REFRESH ACCESS TOKEN
  // =========================================================

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        return null;
      }

      saveAccessToken(newAccessToken);

      // Some JWT configurations may return a new refresh token
      if (response.data?.refresh) {
        saveRefreshToken(response.data.refresh);
      }

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  };

  // =========================================================
  // GET CUSTOMER DATA FROM RESPONSE
  // =========================================================

  const extractCustomerData = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    if (Array.isArray(data?.customers)) {
      return data.customers;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  // =========================================================
  // API REQUEST
  // =========================================================

  const requestCustomers = async (token) => {
    return axios.get(`${BASEURL}/api/customers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  };

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      let token = getAccessToken();

      // -------------------------------------------------------
      // No access token
      // -------------------------------------------------------

      if (!token) {
        token = await refreshAccessToken();
      }

      if (!token) {
        setCustomers([]);

        toast.error("Please login again to access customers.", {
          position: "top-right",
          style: bigToastStyle,
        });

        return;
      }

      // -------------------------------------------------------
      // First request
      // -------------------------------------------------------

      let response;

      try {
        response = await requestCustomers(token);
      } catch (error) {
        // -----------------------------------------------------
        // Access token expired → refresh token
        // -----------------------------------------------------

        if (error.response?.status === 401) {
          const newToken = await refreshAccessToken();

          if (!newToken) {
            setCustomers([]);

            toast.error(
              "Your session has expired. Please login again.",
              {
                position: "top-right",
                style: bigToastStyle,
              }
            );

            return;
          }

          // Retry with new token
          response = await requestCustomers(newToken);
        } else {
          throw error;
        }
      }

      // -------------------------------------------------------
      // Success
      // -------------------------------------------------------

      const customerData = extractCustomerData(response.data);

      setCustomers(customerData);
    } catch (error) {
      console.error("Customer fetch error:", error);

      // -------------------------------------------------------
      // 401
      // -------------------------------------------------------

      if (error.response?.status === 401) {
        toast.error(
          "Authentication failed. Please logout and login again.",
          {
            position: "top-right",
            style: bigToastStyle,
          }
        );
      }

      // -------------------------------------------------------
      // 403
      // -------------------------------------------------------

      else if (error.response?.status === 403) {
        toast.error(
          "You do not have permission to view customers.",
          {
            position: "top-right",
            style: bigToastStyle,
          }
        );
      }

      // -------------------------------------------------------
      // Other errors
      // -------------------------------------------------------

      else {
        toast.error("Failed to load customers.", {
          position: "top-right",
          style: bigToastStyle,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // FILTER CUSTOMERS
  // =========================================================

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const fullName =
        `${customer.first_name || ""} ${
          customer.last_name || ""
        }`.trim();

      const matchesSearch =
        !searchText ||
        fullName.toLowerCase().includes(searchText) ||
        (customer.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(customer.phone_number || "")
          .toLowerCase()
          .includes(searchText) ||
        (customer.address || "")
          .toLowerCase()
          .includes(searchText);

      const customerStatus =
        customer.status ||
        (customer.is_active ? "Active" : "Inactive");

      const matchesStatus =
        statusFilter === "All" ||
        customerStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredCustomers.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================================================
  // STATS
  // =========================================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter((customer) => {
    const status =
      customer.status ||
      (customer.is_active ? "Active" : "Inactive");

    return status.toLowerCase() === "active";
  }).length;

  const inactiveCustomers = customers.filter((customer) => {
    const status =
      customer.status ||
      (customer.is_active ? "Active" : "Inactive");

    return status.toLowerCase() === "inactive";
  }).length;

  const totalRevenue = customers.reduce((total, customer) => {
    return total + Number(customer.total_spent || 0);
  }, 0);

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatMoney = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "No order yet";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const getCustomerName = (customer) => {
    const name =
      `${customer.first_name || ""} ${
        customer.last_name || ""
      }`.trim();

    return name || "Unknown Customer";
  };

  // =========================================================
  // AVATAR LETTER
  // =========================================================

  const getAvatarLetter = (customer) => {
    const name = getCustomerName(customer);

    return name.charAt(0).toUpperCase();
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = () => {
    toast.info(
      "Customer editing API is not available yet.",
      {
        position: "top-right",
        style: bigToastStyle,
      }
    );
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = () => {
    toast.info(
      "Customer delete API is not available yet.",
      {
        position: "top-right",
        style: bigToastStyle,
      }
    );
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    fetchCustomers();
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#5fd6bd] rounded-full animate-spin" />

          <p className="text-sm text-gray-500">
            Loading customers...
          </p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] p-3 sm:p-4 md:p-5 lg:p-6">

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 md:mb-6">

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Customers
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and view your customers
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            px-4 py-2.5
            rounded-lg
            bg-white
            border border-gray-200
            text-gray-700
            text-sm
            font-medium
            hover:bg-gray-50
            transition
            shrink-0
          "
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 md:mb-6">

        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Total Customers
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
                {totalCustomers}
              </h2>
            </div>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#e6faf5] flex items-center justify-center text-[#39b99d] shrink-0">
              <FiUsers size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Active Customers
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
                {activeCustomers}
              </h2>
            </div>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
              <FiUser size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Inactive Customers
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
                {inactiveCustomers}
              </h2>
            </div>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <FiUser size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2 truncate">
                {formatMoney(totalRevenue)}
              </h2>
            </div>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <span className="text-xl sm:text-2xl font-bold leading-none">
                ৳
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3 sm:p-4 mb-5">

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer..."
              className="
                w-full
                pl-10 pr-4
                py-2.5
                rounded-lg
                border border-gray-200
                outline-none
                text-sm
                text-gray-700
                focus:border-[#5fd6bd]
                focus:ring-2
                focus:ring-[#5fd6bd]/20
              "
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
                  px-3 sm:px-4
                  py-2
                  rounded-lg
                  text-xs sm:text-sm
                  font-medium
                  transition
                  ${
                    statusFilter === status
                      ? "bg-[#5fd6bd] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER LIST
      ===================================================== */}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Customer List
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ===================================================
            DESKTOP
        =================================================== */}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Customer
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Contact
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Location
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Orders
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Total Spent
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Status
                </th>

                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => {

                  const name = getCustomerName(customer);

                  const customerStatus =
                    customer.status ||
                    (customer.is_active
                      ? "Active"
                      : "Inactive");

                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-50 hover:bg-gray-50/70 transition"
                    >

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-[#dff8f1]
                            text-[#38ad94]
                            flex
                            items-center
                            justify-center
                            font-semibold
                            text-sm
                            shrink-0
                          ">
                            {getAvatarLetter(customer)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate max-w-[170px]">
                              {name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: #{customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FiMail
                              size={13}
                              className="text-gray-400 shrink-0"
                            />

                            <span className="truncate max-w-[190px]">
                              {customer.email || "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiPhone
                              size={13}
                              className="text-gray-400 shrink-0"
                            />

                            <span>
                              {customer.phone_number || "N/A"}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2 max-w-[180px]">

                          <FiMapPin
                            size={14}
                            className="text-gray-400 mt-0.5 shrink-0"
                          />

                          <span className="text-xs text-gray-600 line-clamp-2">
                            {customer.address || "N/A"}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <FiShoppingBag
                            size={14}
                            className="text-gray-400"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {customer.total_orders || 0}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {formatMoney(customer.total_spent)}
                        </span>
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            items-center
                            px-2.5
                            py-1
                            rounded-full
                            text-[11px]
                            font-semibold
                            ${
                              customerStatus.toLowerCase() ===
                              "active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }
                          `}
                        >
                          {customerStatus}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-1">

                          <button
                            onClick={() =>
                              handleView(customer)
                            }
                            title="View"
                            className="
                              w-8 h-8
                              rounded-lg
                              flex items-center justify-center
                              text-gray-500
                              hover:bg-blue-50
                              hover:text-blue-500
                              transition
                            "
                          >
                            <FiEye size={15} />
                          </button>

                          <button
                            onClick={() =>
                              handleEdit(customer)
                            }
                            title="Edit"
                            className="
                              w-8 h-8
                              rounded-lg
                              flex items-center justify-center
                              text-gray-500
                              hover:bg-green-50
                              hover:text-green-500
                              transition
                            "
                          >
                            <FiEdit size={15} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(customer)
                            }
                            title="Delete"
                            className="
                              w-8 h-8
                              rounded-lg
                              flex items-center justify-center
                              text-gray-500
                              hover:bg-red-50
                              hover:text-red-500
                              transition
                            "
                          >
                            <FiTrash2 size={15} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>

        {/* ===================================================
            MOBILE
        =================================================== */}

        <div className="md:hidden">

          {paginatedCustomers.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No customers found.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {paginatedCustomers.map((customer) => {

                const name = getCustomerName(customer);

                const customerStatus =
                  customer.status ||
                  (customer.is_active
                    ? "Active"
                    : "Inactive");

                return (
                  <div
                    key={customer.id}
                    className="p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="
                          w-11 h-11
                          rounded-full
                          bg-[#dff8f1]
                          text-[#38ad94]
                          flex items-center justify-center
                          font-semibold
                          shrink-0
                        ">
                          {getAvatarLetter(customer)}
                        </div>

                        <div className="min-w-0">

                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {name}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            ID: #{customer.id}
                          </p>

                        </div>

                      </div>

                      <span
                        className={`
                          shrink-0
                          px-2.5 py-1
                          rounded-full
                          text-[10px]
                          font-semibold
                          ${
                            customerStatus.toLowerCase() ===
                            "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }
                        `}
                      >
                        {customerStatus}
                      </span>

                    </div>

                    <div className="mt-4 space-y-2">

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiMail
                          size={14}
                          className="text-gray-400 shrink-0"
                        />

                        <span className="truncate">
                          {customer.email || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiPhone
                          size={14}
                          className="text-gray-400 shrink-0"
                        />

                        <span>
                          {customer.phone_number || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <FiMapPin
                          size={14}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />

                        <span className="break-words">
                          {customer.address || "N/A"}
                        </span>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-gray-400 uppercase">
                          Orders
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {customer.total_orders || 0}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-gray-400 uppercase">
                          Spent
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {formatMoney(
                            customer.total_spent
                          )}
                        </p>
                      </div>

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button
                        onClick={() =>
                          handleView(customer)
                        }
                        className="
                          flex-1
                          flex items-center justify-center gap-2
                          py-2.5
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          text-xs
                          font-medium
                        "
                      >
                        <FiEye size={14} />
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleEdit(customer)
                        }
                        className="
                          flex-1
                          flex items-center justify-center gap-2
                          py-2.5
                          rounded-lg
                          bg-green-50
                          text-green-600
                          text-xs
                          font-medium
                        "
                      >
                        <FiEdit size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(customer)
                        }
                        className="
                          w-10
                          flex items-center justify-center
                          rounded-lg
                          bg-red-50
                          text-red-500
                        "
                      >
                        <FiTrash2 size={14} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {filteredCustomers.length > 0 && totalPages > 1 && (
          <div className="
            px-4 sm:px-5
            py-4
            border-t border-gray-100
            flex flex-col sm:flex-row
            items-center justify-between
            gap-3
          ">

            <p className="text-xs text-gray-500 text-center sm:text-left">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {startIndex + 1}
              </span>

              {" "}to{" "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredCustomers.length
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-700">
                {filteredCustomers.length}
              </span>

            </p>

            <div className="flex items-center gap-1">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                className="
                  w-8 h-8
                  rounded-lg
                  border border-gray-200
                  flex items-center justify-center
                  text-gray-500
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-gray-50
                "
              >
                <FiChevronLeft size={15} />
              </button>

              <div className="flex items-center gap-1 max-w-[180px] overflow-x-auto">

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`
                      w-8 h-8
                      rounded-lg
                      text-xs
                      font-medium
                      shrink-0
                      ${
                        currentPage === page
                          ? "bg-[#5fd6bd] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                className="
                  w-8 h-8
                  rounded-lg
                  border border-gray-200
                  flex items-center justify-center
                  text-gray-500
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-gray-50
                "
              >
                <FiChevronRight size={15} />
              </button>

            </div>
          </div>
        )}

      </div>

      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ===================================================== */}

      {showDetails && selectedCustomer && (
        <div
          className="
            fixed inset-0
            z-[100]
            bg-black/40
            flex items-center justify-center
            p-3 sm:p-4
          "
          onClick={() => setShowDetails(false)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white
              w-full
              max-w-lg
              rounded-2xl
              shadow-2xl
              max-h-[92vh]
              overflow-y-auto
            "
          >

            <div className="
              sticky top-0
              bg-white
              z-10
              flex items-center justify-between
              px-4 sm:px-5
              py-4
              border-b border-gray-100
            ">

              <div className="min-w-0">

                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Customer Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Customer ID: #{selectedCustomer.id}
                </p>

              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="
                  w-8 h-8
                  rounded-lg
                  flex items-center justify-center
                  text-gray-500
                  hover:bg-gray-100
                  shrink-0
                "
              >
                <FiX size={18} />
              </button>

            </div>

            <div className="p-4 sm:p-5">

              <div className="flex items-center gap-3 sm:gap-4 mb-6">

                <div className="
                  w-14 h-14
                  sm:w-16 sm:h-16
                  rounded-full
                  bg-[#dff8f1]
                  text-[#38ad94]
                  flex items-center justify-center
                  text-lg sm:text-xl
                  font-bold
                  shrink-0
                ">
                  {getAvatarLetter(selectedCustomer)}
                </div>

                <div className="min-w-0">

                  <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                    {getCustomerName(selectedCustomer)}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 break-all">
                    {selectedCustomer.email || "No email"}
                  </p>

                </div>

              </div>

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FiMail
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p className="text-sm text-gray-700 break-all">
                      {selectedCustomer.email || "N/A"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FiPhone
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="text-sm text-gray-700">
                      {selectedCustomer.phone_number || "N/A"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FiMapPin
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-400">
                      Address
                    </p>

                    <p className="text-sm text-gray-700 break-words">
                      {selectedCustomer.address || "N/A"}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400">
                      Total Orders
                    </p>

                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {selectedCustomer.total_orders || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400">
                      Total Spent
                    </p>

                    <p className="text-lg font-bold text-gray-800 mt-1 break-words">
                      {formatMoney(
                        selectedCustomer.total_spent
                      )}
                    </p>
                  </div>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-xs text-gray-400">
                    Last Order
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {formatDate(
                      selectedCustomer.last_order_date
                    )}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-xs text-gray-400">
                    Customer Since
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {formatDate(
                      selectedCustomer.date_joined
                    )}
                  </p>

                </div>

              </div>
            </div>

            <div className="
              sticky bottom-0
              bg-white
              px-4 sm:px-5
              py-4
              border-t border-gray-100
              flex justify-end
            ">

              <button
                onClick={() => setShowDetails(false)}
                className="
                  w-full sm:w-auto
                  px-5 py-2.5
                  rounded-lg
                  bg-[#5fd6bd]
                  text-white
                  text-sm
                  font-medium
                  hover:bg-[#4fc8ae]
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;


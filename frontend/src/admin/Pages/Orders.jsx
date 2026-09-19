import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import { toast } from "react-toastify";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

const ORDERS_PER_PAGE = 10;

const statusConfig = {
  Pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: FiClock,
  },
  Processing: {
    color: "bg-blue-100 text-blue-700",
    icon: FiPackage,
  },
  Shipped: {
    color: "bg-purple-100 text-purple-700",
    icon: FiTruck,
  },
  Delivered: {
    color: "bg-green-100 text-green-700",
    icon: FiCheckCircle,
  },
  Cancelled: {
    color: "bg-red-100 text-red-700",
    icon: FiXCircle,
  },
};

const normalizeStatus = (status) => {
  if (!status) return "Pending";

  const value = String(status).toLowerCase();

  if (value === "pending") return "Pending";
  if (value === "processing") return "Processing";
  if (value === "shipped") return "Shipped";
  if (value === "delivered") return "Delivered";
  if (value === "cancelled" || value === "canceled") return "Cancelled";

  return (
    String(status).charAt(0).toUpperCase() +
    String(status).slice(1).toLowerCase()
  );
};

const getOrderId = (order) => {
  return order?.id || order?.order_id || order?.pk;
};

/* =========================
   CUSTOMER NAME
========================= */

const getCustomerName = (order) => {
  const firstName = order?.first_name || "";
  const lastName = order?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "N/A";
};

/* =========================
   CUSTOMER EMAIL
========================= */

const getCustomerEmail = (order) => {
  return order?.email || "N/A";
};

/* =========================
   CUSTOMER PHONE
========================= */

const getCustomerPhone = (order) => {
  return order?.phone_number || "N/A";
};

const getOrderDate = (order) => {
  return (
    order?.created_at ||
    order?.created ||
    order?.order_date ||
    order?.date ||
    null
  );
};

const getOrderStatus = (order) => {
  return normalizeStatus(
    order?.status || order?.order_status || order?.orderStatus
  );
};

const getOrderTotal = (order) => {
  return (
    Number(
      order?.total_amount ??
        order?.total_price ??
        order?.grand_total ??
        order?.total ??
        0
    ) || 0
  );
};

const getOrderItems = (order) => {
  return (
    order?.items ||
    order?.order_items ||
    order?.orderItems ||
    order?.products ||
    []
  );
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProductName = (item) => {
  return (
    item?.product?.name ||
    item?.product_name ||
    item?.name ||
    item?.product?.title ||
    "Product"
  );
};

const getProductQuantity = (item) => {
  return Number(item?.quantity ?? item?.qty ?? 1);
};

const getProductPrice = (item) => {
  return Number(
    item?.price ??
      item?.unit_price ??
      item?.product?.price ??
      item?.product_price ??
      0
  );
};

const getProductImage = (item) => {
  const image =
    item?.product?.image ||
    item?.image ||
    item?.product_image ||
    item?.product?.image_url;

  if (!image) return null;

  if (String(image).startsWith("http")) {
    return image;
  }

  return `${BASEURL}${String(image).startsWith("/") ? "" : "/"}${image}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(`${BASEURL}/api/orders/`, {
        headers: getAuthHeaders(),
      });

      const data = response.data;

      let orderList = [];

      if (Array.isArray(data)) {
        orderList = data;
      } else if (Array.isArray(data?.results)) {
        orderList = data.results;
      } else if (Array.isArray(data?.orders)) {
        orderList = data.orders;
      }

      setOrders(orderList);
    } catch (error) {
      console.error("Orders fetch error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again.");
      } else {
        toast.error("Failed to load orders.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => getOrderStatus(order) === "Pending"
    ).length;

    const processing = orders.filter(
      (order) => getOrderStatus(order) === "Processing"
    ).length;

    const shipped = orders.filter(
      (order) => getOrderStatus(order) === "Shipped"
    ).length;

    const delivered = orders.filter(
      (order) => getOrderStatus(order) === "Delivered"
    ).length;

    const cancelled = orders.filter(
      (order) => getOrderStatus(order) === "Cancelled"
    ).length;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((order) => {
        const id = String(getOrderId(order) || "").toLowerCase();

        const customer = getCustomerName(order).toLowerCase();

        const email = getCustomerEmail(order).toLowerCase();

        const phone = getCustomerPhone(order).toLowerCase();

        return (
          id.includes(searchValue) ||
          customer.includes(searchValue) ||
          email.includes(searchValue) ||
          phone.includes(searchValue)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (order) => getOrderStatus(order) === statusFilter
      );
    }

    if (dateFilter !== "All") {
      const now = new Date();

      result = result.filter((order) => {
        const orderDateValue = getOrderDate(order);

        if (!orderDateValue) return false;

        const orderDate = new Date(orderDateValue);

        if (Number.isNaN(orderDate.getTime())) {
          return false;
        }

        if (dateFilter === "Today") {
          return orderDate.toDateString() === now.toDateString();
        }

        if (dateFilter === "7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);

          return orderDate >= sevenDaysAgo;
        }

        if (dateFilter === "30 Days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          return orderDate >= thirtyDaysAgo;
        }

        return true;
      });
    }

    return result;
  }, [orders, search, statusFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );

  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

    return filteredOrders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE
    );
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeOrderDetails = () => {
    if (updatingStatus) return;

    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;

    const orderId = getOrderId(selectedOrder);

    if (!orderId) {
      toast.error("Order ID not found.");
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await axios.patch(
        `${BASEURL}/api/orders/${orderId}/`,
        {
          status: newStatus.toLowerCase(),
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      const updatedOrder = response.data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          getOrderId(order) === orderId
            ? updatedOrder?.id
              ? updatedOrder
              : {
                  ...order,
                  status: newStatus.toLowerCase(),
                }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous
          ? updatedOrder?.id
            ? updatedOrder
            : {
                ...previous,
                status: newStatus.toLowerCase(),
              }
          : previous
      );

      toast.success(`Order status changed to ${newStatus}.`);
    } catch (error) {
      console.error("Status update error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again.");
      } else if (error.response?.status === 403) {
        toast.error(
          "You do not have permission to update this order."
        );
      } else {
        toast.error(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Failed to update order status."
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiRefreshCw
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatBox
          title="Total Orders"
          value={stats.total}
          icon={FiPackage}
          iconClass="bg-gray-100 text-gray-700"
        />

        <StatBox
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          iconClass="bg-yellow-100 text-yellow-600"
        />

        <StatBox
          title="Processing"
          value={stats.processing}
          icon={FiPackage}
          iconClass="bg-blue-100 text-blue-600"
        />

        <StatBox
          title="Shipped"
          value={stats.shipped}
          icon={FiTruck}
          iconClass="bg-purple-100 text-purple-600"
        />

        <StatBox
          title="Delivered"
          value={stats.delivered}
          icon={FiCheckCircle}
          iconClass="bg-green-100 text-green-600"
        />

        <StatBox
          title="Cancelled"
          value={stats.cancelled}
          icon={FiXCircle}
          iconClass="bg-red-100 text-red-600"
        />
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FiFilter className="text-gray-500" />

          <h2 className="font-semibold text-gray-800">
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#DB4444] focus:bg-white focus:ring-2 focus:ring-[#DB4444]/10"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#DB4444] focus:bg-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Date */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#DB4444] focus:bg-white"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="7 Days">Last 7 Days</option>
            <option value="30 Days">Last 30 Days</option>
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              All Orders
            </h2>

            <p className="text-xs text-gray-500">
              Showing{" "}
              {filteredOrders.length === 0
                ? 0
                : (currentPage - 1) * ORDERS_PER_PAGE + 1}
              {" - "}
              {Math.min(
                currentPage * ORDERS_PER_PAGE,
                filteredOrders.length
              )}{" "}
              of {filteredOrders.length} orders
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredOrders.length === 0 ? (
          <EmptyState resetFilters={resetFilters} />
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Items
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Total
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((order) => {
                    const orderId = getOrderId(order);
                    const status = getOrderStatus(order);
                    const StatusIcon =
                      statusConfig[status]?.icon || FiClock;

                    const statusColor =
                      statusConfig[status]?.color ||
                      "bg-gray-100 text-gray-700";

                    const items = getOrderItems(order);

                    const itemCount = Array.isArray(items)
                      ? items.reduce(
                          (sum, item) =>
                            sum + getProductQuantity(item),
                          0
                        )
                      : Number(order?.total_items || 0);

                    return (
                      <tr
                        key={orderId}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-800">
                            #{orderId}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Order ID
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-[#DB4444]">
                              {getCustomerName(order)
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium text-gray-800">
                                {getCustomerName(order)}
                              </p>

                              <p className="max-w-[180px] truncate text-xs text-gray-400">
                                {getCustomerEmail(order)}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {getCustomerPhone(order)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(getOrderDate(order))}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {itemCount} item
                          {itemCount !== 1 ? "s" : ""}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-800">
                            ৳ {getOrderTotal(order).toFixed(2)}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusColor}`}
                          >
                            <StatusIcon size={13} />
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                          >
                            <FiEye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeOrderDetails}
          onStatusChange={updateOrderStatus}
          updatingStatus={updatingStatus}
        />
      )}
    </div>
  );
};

/* =========================
   STAT BOX
========================= */

const StatBox = ({
  title,
  value,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

/* =========================
   PAGINATION
========================= */

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-gray-500 sm:text-sm">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center justify-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prev) => Math.max(1, prev - 1))
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft />
        </button>

        <div className="flex items-center gap-1 overflow-x-auto">
          {getPages().map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="flex h-9 w-7 items-center justify-center text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-[#DB4444] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(totalPages, prev + 1)
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

/* =========================
   LOADING
========================= */

const LoadingState = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#DB4444]" />

        <p className="text-sm text-gray-500">
          Loading orders...
        </p>
      </div>
    </div>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ resetFilters }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <FiPackage size={28} className="text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        No orders found
      </h3>

      <p className="mt-1 max-w-md text-sm text-gray-500">
        No orders match your current search or filter.
      </p>

      <button
        onClick={resetFilters}
        className="mt-4 rounded-lg bg-[#DB4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#c93636]"
      >
        Clear Filters
      </button>
    </div>
  );
};

/* =========================
   ORDER DETAILS MODAL
========================= */

const OrderDetailsModal = ({
  order,
  onClose,
  onStatusChange,
  updatingStatus,
}) => {
  const orderId = getOrderId(order);
  const status = getOrderStatus(order);
  const items = getOrderItems(order);

  const [selectedStatus, setSelectedStatus] =
    useState(status);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  // Customer information
  const customerName = getCustomerName(order);
  const customerEmail = getCustomerEmail(order);
  const customerPhone = getCustomerPhone(order);

  // Billing / Shipping address
  const shippingAddress = [
    order?.street_address,
    order?.apartment,
    order?.town_city,
  ]
    .filter(Boolean)
    .join(", ") || "No shipping address available";

  const paymentMethod =
    order?.payment_method ||
    order?.paymentMethod ||
    order?.payment_type ||
    "N/A";

  const total = getOrderTotal(order);

  const subtotal = Number(
    order?.subtotal ??
      order?.sub_total ??
      order?.subTotal ??
      0
  );

  const discount = Number(
    order?.discount ?? 0
  );

  const shippingCost = Number(
    order?.shipping_charge ?? 0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              Order #{orderId}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {formatDateTime(getOrderDate(order))}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={updatingStatus}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">

          {/* Customer + Status */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Customer */}
            <div className="rounded-xl border border-gray-200 p-4">

              <div className="mb-4 flex items-center gap-2">
                <FiUser className="text-[#DB4444]" />

                <h3 className="font-semibold text-gray-800">
                  Customer Information
                </h3>
              </div>

              <div className="space-y-3">

                <InfoRow
                  icon={FiUser}
                  label="Name"
                  value={customerName}
                />

                <InfoRow
                  icon={FiMail}
                  label="Email"
                  value={customerEmail}
                />

                <InfoRow
                  icon={FiPhone}
                  label="Phone"
                  value={customerPhone}
                />

                <InfoRow
                  icon={FiMapPin}
                  label="Address"
                  value={shippingAddress}
                />

              </div>
            </div>

            {/* Order Status */}
            <div className="rounded-xl border border-gray-200 p-4">

              <div className="mb-4 flex items-center gap-2">
                <FiPackage className="text-[#DB4444]" />

                <h3 className="font-semibold text-gray-800">
                  Order Status
                </h3>
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-600">
                Update Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                disabled={updatingStatus}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#DB4444] focus:bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() =>
                  onStatusChange(selectedStatus)
                }
                disabled={
                  updatingStatus || selectedStatus === status
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#DB4444] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#c93636] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingStatus && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}

                {updatingStatus
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="mt-5 rounded-xl border border-gray-200">

            <div className="border-b border-gray-100 px-4 py-4">
              <h3 className="font-semibold text-gray-800">
                Order Items
              </h3>
            </div>

            {Array.isArray(items) && items.length > 0 ? (
              <div className="divide-y divide-gray-100">

                {items.map((item, index) => {
                  const image = getProductImage(item);
                  const productName = getProductName(item);
                  const quantity = getProductQuantity(item);
                  const price = getProductPrice(item);

                  return (
                    <div
                      key={item?.id || index}
                      className="flex items-center gap-3 p-4"
                    >

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiPackage
                            className="text-gray-400"
                            size={22}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {productName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {quantity}
                        </p>
                      </div>

                      <div className="text-right">

                        <p className="text-sm font-semibold text-gray-800">
                          ৳ {(price * quantity).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400">
                          ৳ {price.toFixed(2)} each
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No item details available.
              </div>
            )}
          </div>

          {/* Payment + Summary */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Payment */}
            <div className="rounded-xl border border-gray-200 p-4">

              <div className="mb-4 flex items-center gap-2">
                <FiCreditCard className="text-[#DB4444]" />

                <h3 className="font-semibold text-gray-800">
                  Payment Information
                </h3>
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="font-medium text-gray-800">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span className="font-medium text-green-600">
                    {order?.payment_status ||
                      order?.paymentStatus ||
                      "N/A"}
                  </span>
                </div>

              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 p-4">

              <div className="mb-4 flex items-center gap-2">
                <FiCreditCard className="text-[#DB4444]" />

                <h3 className="font-semibold text-gray-800">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-3 text-sm">

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-800">
                    ৳ {subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span className="font-medium text-green-600">
                    - ৳ {discount.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-gray-800">
                    ৳ {shippingCost.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-gray-800">
                      Total
                    </span>

                    <span className="text-lg font-bold text-[#DB4444]">
                      ৳ {total.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            <FiCalendar />

            <span>
              Order placed on{" "}
              <span className="font-medium text-gray-700">
                {formatDateTime(getOrderDate(order))}
              </span>
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-300 px-4 py-3 sm:px-6">

          <button
            onClick={onClose}
            disabled={updatingStatus}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-red-500 transition bg-gray-100 hover:bg-gray-300"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

/* =========================
   INFO ROW
========================= */

const InfoRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">

      <Icon
        size={16}
        className="mt-0.5 shrink-0 text-gray-400"
      />

      <div className="min-w-0">

        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="break-words text-sm font-medium text-gray-700">
          {value}
        </p>

      </div>
    </div>
  );
};

export default Orders;
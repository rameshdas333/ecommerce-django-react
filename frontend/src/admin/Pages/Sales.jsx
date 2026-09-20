import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  FiCalendar,
  FiChevronDown,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL ||
  "http://127.0.0.1:8000";

/* =========================
   AUTH HEADERS
========================= */

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================
   HELPERS
========================= */

const getOrderId = (order) => {
  return order?.id || order?.order_id || order?.pk;
};

const getCustomerName = (order) => {
  const firstName = order?.first_name || "";
  const lastName = order?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "N/A";
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
  return String(
    order?.status ||
      order?.order_status ||
      order?.orderStatus ||
      "pending"
  ).toLowerCase();
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

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return `৳ ${Number(amount || 0).toFixed(2)}`;
};

/* =========================
   SALES PAGE
========================= */

const Sales = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dateFilter, setDateFilter] = useState("30 Days");

  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token");

      console.log("Sales API calling...");

      console.log(
        "Sales API URL:",
        `${BASEURL}/api/orders/`
      );

      console.log(
        "Token exists:",
        !!token
      );

      const response = await axios.get(
        `${BASEURL}/api/orders/`,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(
        "Sales API response:",
        response.data
      );

      const data = response.data;

      let orderList = [];

      /* =========================
         HANDLE DIFFERENT RESPONSE
      ========================= */

      if (Array.isArray(data)) {
        orderList = data;
      } else if (
        Array.isArray(data?.results)
      ) {
        orderList = data.results;
      } else if (
        Array.isArray(data?.orders)
      ) {
        orderList = data.orders;
      } else if (
        Array.isArray(data?.data)
      ) {
        orderList = data.data;
      }

      console.log(
        "Sales orders received:",
        orderList.length
      );

      setOrders(orderList);
    } catch (error) {
      console.error(
        "Sales fetch error:",
        error
      );

      console.error(
        "Sales error response:",
        error?.response?.data
      );

      /* =========================
         LOGIN ERROR TOAST
      ========================= */

      if (error.response?.status === 401) {
        toast.error(
          "Please login again.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId:
              "sales-login-error",

            style: {
              fontSize: "16px",
              fontWeight: "600",
              padding: "16px 20px",
              minWidth: "320px",
              borderRadius: "10px",
            },
          }
        );
      } else if (
        error.response?.status === 403
      ) {
        toast.error(
          "You don't have permission to view sales.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,

            style: {
              fontSize: "16px",
              fontWeight: "600",
              padding: "16px 20px",
              minWidth: "320px",
              borderRadius: "10px",
            },
          }
        );
      } else {
        toast.error(
          "Failed to load sales data.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,

            style: {
              fontSize: "16px",
              fontWeight: "600",
              padding: "16px 20px",
              minWidth: "320px",
              borderRadius: "10px",
            },
          }
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* =========================
     INITIAL API CALL
  ========================= */

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================
     AUTO REFRESH
     EVERY 10 SECONDS
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchOrders]);

  /* =========================
     REFRESH WHEN TAB ACTIVE
  ========================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        fetchOrders();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchOrders]);

  /* =========================
     DELIVERED ORDERS
  ========================= */

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        getOrderStatus(order) ===
        "delivered"
    );
  }, [orders]);

  /* =========================
     DATE FILTER
  ========================= */

  const filteredSales = useMemo(() => {
    const now = new Date();

    return deliveredOrders.filter(
      (order) => {
        const orderDateValue =
          getOrderDate(order);

        if (!orderDateValue) {
          return false;
        }

        const orderDate =
          new Date(orderDateValue);

        if (
          Number.isNaN(
            orderDate.getTime()
          )
        ) {
          return false;
        }

        /* ALL */

        if (dateFilter === "All") {
          return true;
        }

        /* TODAY */

        if (dateFilter === "Today") {
          return (
            orderDate.toDateString() ===
            now.toDateString()
          );
        }

        /* LAST 7 DAYS */

        if (dateFilter === "7 Days") {
          const sevenDaysAgo =
            new Date();

          sevenDaysAgo.setDate(
            now.getDate() - 7
          );

          return (
            orderDate >=
            sevenDaysAgo
          );
        }

        /* LAST 30 DAYS */

        if (dateFilter === "30 Days") {
          const thirtyDaysAgo =
            new Date();

          thirtyDaysAgo.setDate(
            now.getDate() - 30
          );

          return (
            orderDate >=
            thirtyDaysAgo
          );
        }

        /* THIS YEAR */

        if (
          dateFilter === "This Year"
        ) {
          return (
            orderDate.getFullYear() ===
            now.getFullYear()
          );
        }

        return true;
      }
    );
  }, [deliveredOrders, dateFilter]);

  /* =========================
     SALES STATISTICS
  ========================= */

  const salesStats = useMemo(() => {
    let totalSales = 0;
    let productsSold = 0;

    filteredSales.forEach((order) => {
      totalSales +=
        getOrderTotal(order);

      const items =
        getOrderItems(order);

      if (Array.isArray(items)) {
        items.forEach((item) => {
          productsSold +=
            getProductQuantity(item);
        });
      }
    });

    return {
      totalSales,

      totalOrders:
        filteredSales.length,

      productsSold,

      averageOrder:
        filteredSales.length > 0
          ? totalSales /
            filteredSales.length
          : 0,
    };
  }, [filteredSales]);

  /* =========================
     TODAY'S SALES
  ========================= */

  const todaySales = useMemo(() => {
    const today = new Date();

    return deliveredOrders.reduce(
      (total, order) => {
        const dateValue =
          getOrderDate(order);

        if (!dateValue) {
          return total;
        }

        const orderDate =
          new Date(dateValue);

        if (
          !Number.isNaN(
            orderDate.getTime()
          ) &&
          orderDate.toDateString() ===
            today.toDateString()
        ) {
          return (
            total +
            getOrderTotal(order)
          );
        }

        return total;
      },
      0
    );
  }, [deliveredOrders]);

  /* =========================
     TOP PRODUCTS
  ========================= */

  const topProducts = useMemo(() => {
    const productMap = {};

    filteredSales.forEach((order) => {
      const items =
        getOrderItems(order);

      if (!Array.isArray(items)) {
        return;
      }

      items.forEach((item) => {
        const productName =
          getProductName(item);

        const quantity =
          getProductQuantity(item);

        const price = Number(
          item?.price ??
            item?.unit_price ??
            item?.product?.price ??
            item?.product_price ??
            0
        );

        if (
          !productMap[productName]
        ) {
          productMap[productName] = {
            name: productName,
            quantity: 0,
            revenue: 0,
          };
        }

        productMap[
          productName
        ].quantity += quantity;

        productMap[
          productName
        ].revenue +=
          price * quantity;
      });
    });

    return Object.values(productMap)
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 5);
  }, [filteredSales]);

  /* =========================
     DAILY SALES
  ========================= */

  const dailySales = useMemo(() => {
    const salesMap = {};

    filteredSales.forEach((order) => {
      const dateValue =
        getOrderDate(order);

      if (!dateValue) {
        return;
      }

      const date =
        new Date(dateValue);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return;
      }

      const key = date
        .toISOString()
        .split("T")[0];

      if (!salesMap[key]) {
        salesMap[key] = 0;
      }

      salesMap[key] +=
        getOrderTotal(order);
    });

    return Object.entries(salesMap)
      .sort(
        ([dateA], [dateB]) =>
          dateA.localeCompare(
            dateB
          )
      )
      .slice(-7)
      .map(
        ([date, amount]) => ({
          date,
          amount,
        })
      );
  }, [filteredSales]);

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Sales
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your sales, revenue and
            top-selling products
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

          {/* DATE FILTER */}

          <div className="relative w-full sm:w-44">

            <FiCalendar
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-700 outline-none focus:border-[#DB4444]"
            >
              <option value="Today">
                Today
              </option>

              <option value="7 Days">
                Last 7 Days
              </option>

              <option value="30 Days">
                Last 30 Days
              </option>

              <option value="This Year">
                This Year
              </option>

              <option value="All">
                All Time
              </option>
            </select>

            <FiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>

          {/* REFRESH BUTTON */}

          <button
            onClick={() =>
              fetchOrders(true)
            }
            disabled={refreshing}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <FiRefreshCw
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <SalesStat
          title="Total Sales"
          value={formatCurrency(
            salesStats.totalSales
          )}
          iconClass="bg-green-100 text-green-600"
          takaIcon={true}
        />

        <SalesStat
          title="Total Orders"
          value={salesStats.totalOrders}
          icon={FiShoppingBag}
          iconClass="bg-blue-100 text-blue-600"
        />

        <SalesStat
          title="Products Sold"
          value={salesStats.productsSold}
          icon={FiPackage}
          iconClass="bg-purple-100 text-purple-600"
        />

        <SalesStat
          title="Today's Sales"
          value={formatCurrency(
            todaySales
          )}
          icon={FiTrendingUp}
          iconClass="bg-red-100 text-[#DB4444]"
        />

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      {loading ? (
        <LoadingState />
      ) : (
        <>

          {/* =========================
              SALES OVERVIEW
          ========================= */}

          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="font-semibold text-gray-800">
                  Sales Overview
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Revenue from delivered orders
                </p>

              </div>

              <div className="text-left sm:text-right">

                <p className="text-xs text-gray-500">
                  Total Revenue
                </p>

                <p className="text-xl font-bold text-[#DB4444]">
                  {formatCurrency(
                    salesStats.totalSales
                  )}
                </p>

              </div>

            </div>

            {/* CHART */}

            {dailySales.length > 0 ? (
              <div className="overflow-x-auto">

                <div className="min-w-[600px]">

                  <div className="flex h-64 items-end gap-3 border-b border-l border-gray-200 px-3 pb-0 pt-5 sm:gap-5">

                    {dailySales.map(
                      (item) => {

                        const maxAmount =
                          Math.max(
                            ...dailySales.map(
                              (sale) =>
                                sale.amount
                            )
                          );

                        const height =
                          maxAmount > 0
                            ? Math.max(
                                (item.amount /
                                  maxAmount) *
                                  100,
                                5
                              )
                            : 5;

                        return (
                          <div
                            key={item.date}
                            className="flex h-full flex-1 flex-col items-center justify-end"
                          >

                            <div className="mb-2 text-center text-[10px] font-medium text-gray-500 sm:text-xs">
                              {formatCurrency(
                                item.amount
                              )}
                            </div>

                            <div
                              className="w-full max-w-12 rounded-t-lg bg-[#DB4444] transition-all hover:bg-[#c93636]"
                              style={{
                                height: `${height}%`,
                              }}
                              title={formatCurrency(
                                item.amount
                              )}
                            />

                            <div className="mt-2 text-[10px] text-gray-400 sm:text-xs">
                              {new Date(
                                item.date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                  day:
                                    "numeric",
                                }
                              )}
                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">

                <div className="text-center">

                  <FiTrendingUp
                    size={30}
                    className="mx-auto mb-2 text-gray-300"
                  />

                  <p className="text-sm text-gray-500">
                    No sales data available
                  </p>

                </div>

              </div>
            )}

          </div>

          {/* =========================
              TOP PRODUCTS + SUMMARY
          ========================= */}

          <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* TOP PRODUCTS */}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">

                <div>

                  <h2 className="font-semibold text-gray-800">
                    Top Selling Products
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Best performing products
                  </p>

                </div>

                <FiPackage className="text-[#DB4444]" />

              </div>

              {topProducts.length > 0 ? (
                <div className="divide-y divide-gray-100">

                  {topProducts.map(
                    (product, index) => (
                      <div
                        key={`${product.name}-${index}`}
                        className="flex items-center gap-3 p-4 sm:p-5"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[#DB4444]">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-medium text-gray-800">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {product.quantity}{" "}
                            unit
                            {product.quantity !==
                            1
                              ? "s"
                              : ""}{" "}
                            sold
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-sm font-semibold text-gray-800">
                            {formatCurrency(
                              product.revenue
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Revenue
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center px-4 text-center">

                  <div>

                    <FiPackage
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm text-gray-500">
                      No product sales found
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* SALES SUMMARY */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="mb-5 flex items-center gap-2">

                <FiTrendingUp className="text-[#DB4444]" />

                <h2 className="font-semibold text-gray-800">
                  Sales Summary
                </h2>

              </div>

              <div className="space-y-4">

                <SummaryRow
                  label="Total Revenue"
                  value={formatCurrency(
                    salesStats.totalSales
                  )}
                />

                <SummaryRow
                  label="Orders"
                  value={
                    salesStats.totalOrders
                  }
                />

                <SummaryRow
                  label="Products Sold"
                  value={
                    salesStats.productsSold
                  }
                />

                <SummaryRow
                  label="Average Order"
                  value={formatCurrency(
                    salesStats.averageOrder
                  )}
                />

                <div className="border-t border-gray-100 pt-4">

                  <div className="rounded-lg bg-green-50 p-4">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-xs text-green-600">
                          Today's Sales
                        </p>

                        <p className="mt-1 text-lg font-bold text-green-700">
                          {formatCurrency(
                            todaySales
                          )}
                        </p>

                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">

                        <FiTrendingUp className="text-green-600" />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              RECENT SALES
          ========================= */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex flex-col gap-2 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div>

                <h2 className="font-semibold text-gray-800">
                  Recent Sales
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest delivered orders
                </p>

              </div>

              <span className="text-xs text-gray-400">
                {filteredSales.length} sales
              </span>

            </div>

            {filteredSales.length > 0 ? (
              <div className="overflow-x-auto">

                <table className="min-w-[750px] w-full">

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

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Total
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredSales
                      .slice(0, 10)
                      .map((order) => {

                        const items =
                          getOrderItems(
                            order
                          );

                        const itemCount =
                          Array.isArray(items)
                            ? items.reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  getProductQuantity(
                                    item
                                  ),
                                0
                              )
                            : 0;

                        return (
                          <tr
                            key={getOrderId(
                              order
                            )}
                            className="border-b border-gray-100 transition hover:bg-gray-50"
                          >

                            {/* ORDER */}

                            <td className="px-4 py-4">

                              <p className="font-semibold text-gray-800">
                                #
                                {getOrderId(
                                  order
                                )}
                              </p>

                            </td>

                            {/* CUSTOMER */}

                            <td className="px-4 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#DB4444]">

                                  <FiUser
                                    size={16}
                                  />

                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[180px] truncate text-sm font-medium text-gray-800">
                                    {getCustomerName(
                                      order
                                    )}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {order?.email ||
                                      "N/A"}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* DATE */}

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {formatDate(
                                getOrderDate(
                                  order
                                )
                              )}
                            </td>

                            {/* ITEMS */}

                            <td className="px-4 py-4 text-sm text-gray-600">
                              {itemCount}{" "}
                              item
                              {itemCount !==
                              1
                                ? "s"
                                : ""}
                            </td>

                            {/* TOTAL */}

                            <td className="px-4 py-4 text-right">

                              <p className="font-semibold text-gray-800">
                                {formatCurrency(
                                  getOrderTotal(
                                    order
                                  )
                                )}
                              </p>

                              <span className="mt-1 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                Delivered
                              </span>

                            </td>

                          </tr>
                        );
                      })}

                  </tbody>

                </table>

              </div>
            ) : (
              <div className="flex min-h-[250px] items-center justify-center px-4 text-center">

                <div>

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                    <FiShoppingBag
                      size={24}
                      className="text-gray-400"
                    />

                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No sales found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    No delivered orders are
                    available for this period.
                  </p>

                </div>

              </div>
            )}

          </div>

        </>
      )}
    </div>
  );
};

/* =========================
   SALES STAT
========================= */

const SalesStat = ({
  title,
  value,
  icon: Icon,
  iconClass,
  takaIcon = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-xs text-gray-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-1 truncate text-xl font-bold text-gray-800 sm:text-2xl">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >

          {takaIcon ? (
            <span className="text-xl font-bold">
              ৳
            </span>
          ) : Icon ? (
            <Icon size={21} />
          ) : null}

        </div>

      </div>

    </div>
  );
};

/* =========================
   SUMMARY ROW
========================= */

const SummaryRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-800">
        {value}
      </span>

    </div>
  );
};

/* =========================
   LOADING
========================= */

const LoadingState = () => {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">

      <div className="text-center">

        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#DB4444]" />

        <p className="text-sm text-gray-500">
          Loading sales...
        </p>

      </div>

    </div>
  );
};

export default Sales;
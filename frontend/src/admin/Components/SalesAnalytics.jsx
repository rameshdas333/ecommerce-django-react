import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const filterOptions = [
  "7 Days",
  "1 Month",
  "6 Months",
  "12 Months",
  "All",
];

const periodMap = {
  "7 Days": "7_days",
  "1 Month": "1_month",
  "6 Months": "6_months",
  "12 Months": "12_months",
  All: "all",
};

export default function SalesAnalytic() {
  const [filter, setFilter] = useState("1 Month");

  const [dashboardData, setDashboardData] = useState({
    sales_analytics: [],
    sales_summary: {
      income: 0,
      expenses: 0,
      balance: 0,
    },
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH SALES DATA =================
  useEffect(() => {
    const fetchSalesAnalytics = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.error("Access token not found.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_DJANGO_BASE_URL}/api/dashboard/`,
          {
            params: {
              period: periodMap[filter],
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Dashboard API Response:", response.data);

        setDashboardData({
          sales_analytics: response.data?.sales_analytics || [],
          sales_summary: response.data?.sales_summary || {
            income: 0,
            expenses: 0,
            balance: 0,
          },
        });
      } catch (error) {
        console.error(
          "Sales Analytics API Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalesAnalytics();
  }, [filter]);

  // ================= CHART DATA =================
  const chartData = useMemo(() => {
    return dashboardData.sales_analytics.map((item) => ({
      date: item.date,
      value: Number(item.value || 0),
    }));
  }, [dashboardData]);

  // ================= STATS =================
  const stats = useMemo(() => {
    const summary = dashboardData.sales_summary || {};

    return {
      income: Number(summary.income || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),

      expenses: Number(summary.expenses || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),

      balance: Number(summary.balance || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  }, [dashboardData]);

  return (
    <section className="w-full bg-white px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="mx-auto w-full">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-[18px] font-semibold text-gray-900 sm:text-xl lg:text-2xl">
            Sales Analytic
          </h2>

          {/* SORT BY */}
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">

            <label
              htmlFor="sales-filter"
              className="text-[11px] text-gray-500 sm:text-xs lg:text-sm"
            >
              Sort by
            </label>

            <div className="relative">
              <select
                id="sales-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
                  h-8
                  min-w-[110px]
                  appearance-none
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-2.5
                  pr-7
                  text-[11px]
                  text-gray-700
                  outline-none
                  transition
                  focus:border-gray-500
                  focus:ring-1
                  focus:ring-gray-300
                  sm:h-9
                  sm:min-w-[125px]
                  sm:px-3
                  sm:text-xs
                  lg:text-sm
                "
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 sm:right-3 sm:text-[10px]">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-4
            sm:mt-6
            sm:grid-cols-3
            sm:gap-0
          "
        >

          {/* INCOME */}
          <div
            className="
              border-b
              border-gray-200
              pb-4
              sm:border-b-0
              sm:border-r
              sm:pb-0
              sm:pr-4
              lg:pr-6
            "
          >
            <p className="text-[11px] text-gray-400 sm:text-xs lg:text-sm">
              Income
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[18px] font-semibold text-gray-800 sm:text-xl lg:text-2xl">
                {stats.income}
              </span>

              <span className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[8px] font-medium text-blue-500 sm:px-2 sm:py-1 sm:text-[9px]">
                +0.05% ▲
              </span>
            </div>
          </div>

          {/* EXPENSES */}
          <div
            className="
              border-b
              border-gray-200
              pb-4
              sm:border-b-0
              sm:border-r
              sm:px-4
              sm:pb-0
              lg:px-6
            "
          >
            <p className="text-[11px] text-gray-400 sm:text-xs lg:text-sm">
              Expenses
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[18px] font-semibold text-gray-800 sm:text-xl lg:text-2xl">
                {stats.expenses}
              </span>

              <span className="rounded-sm bg-orange-50 px-1.5 py-0.5 text-[8px] font-medium text-orange-500 sm:px-2 sm:py-1 sm:text-[9px]">
                -0.05% ▲
              </span>
            </div>
          </div>

          {/* BALANCE */}
          <div className="sm:pl-4 lg:pl-6">
            <p className="text-[11px] text-gray-400 sm:text-xs lg:text-sm">
              Balance
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[18px] font-semibold text-gray-800 sm:text-xl lg:text-2xl">
                {stats.balance}
              </span>

              <span className="rounded-sm bg-green-50 px-1.5 py-0.5 text-[8px] font-medium text-green-500 sm:px-2 sm:py-1 sm:text-[9px]">
                +0.05% ▲
              </span>
            </div>
          </div>
        </div>

        {/* ================= CHART ================= */}
        <div
          className="
            mt-6
            h-[170px]
            w-full
            sm:mt-7
            sm:h-[190px]
            lg:mt-8
            lg:h-[210px]
          "
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 5,
                left: -15,
                bottom: 0,
              }}
            >

              {/* GRADIENT */}
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6fd8c4"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6fd8c4"
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              {/* GRID */}
              <CartesianGrid
                stroke="#f1f1f1"
                strokeDasharray="3 3"
                vertical={true}
              />

              {/* Y AXIS */}
              <YAxis
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
                tickLine={false}
                axisLine={false}
                width={30}
                tick={{
                  fontSize: 9,
                  fill: "#b5b5b5",
                }}
                tickFormatter={(value) =>
                  value === 0 ? "0" : `${value}k`
                }
              />

              {/* X AXIS */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 9,
                  fill: "#b5b5b5",
                }}
                interval="preserveStartEnd"
                padding={{
                  left: 5,
                  right: 5,
                }}
              />

              {/* TOOLTIP */}
              <Tooltip
                cursor={{
                  stroke: "#d5d5d5",
                  strokeDasharray: "3 3",
                }}
                contentStyle={{
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  fontSize: "11px",
                }}
                formatter={(value) => [`${value}k`, "Sales"]}
              />

              {/* AREA */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6fd8c4"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#6fd8c4",
                }}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const salesData = {
  "7 Days": [
    { date: "Sep 10", value: 12 },
    { date: "Sep 11", value: 24 },
    { date: "Sep 12", value: 18 },
    { date: "Sep 13", value: 35 },
    { date: "Sep 14", value: 20 },
    { date: "Sep 15", value: 42 },
    { date: "Sep 16", value: 28 },
  ],

  "1 Month": [
    { date: "Week 1", value: 18 },
    { date: "Week 2", value: 32 },
    { date: "Week 3", value: 22 },
    { date: "Week 4", value: 45 },
  ],

  "6 Months": [
    { date: "Apr", value: 20 },
    { date: "May", value: 35 },
    { date: "Jun", value: 25 },
    { date: "Jul", value: 48 },
    { date: "Aug", value: 30 },
    { date: "Sep", value: 45 },
  ],

  "12 Months": [
    { date: "Oct", value: 18 },
    { date: "Nov", value: 25 },
    { date: "Dec", value: 20 },
    { date: "Jan", value: 32 },
    { date: "Feb", value: 28 },
    { date: "Mar", value: 38 },
    { date: "Apr", value: 24 },
    { date: "May", value: 35 },
    { date: "Jun", value: 27 },
    { date: "Jul", value: 48 },
    { date: "Aug", value: 34 },
    { date: "Sep", value: 45 },
  ],

  All: [
    { date: "2021", value: 20 },
    { date: "2022", value: 32 },
    { date: "2023", value: 25 },
    { date: "2024", value: 42 },
    { date: "2025", value: 35 },
    { date: "2026", value: 48 },
  ],
};

const statsData = {
  "7 Days": {
    income: "8,262.00",
    expenses: "3,135.00",
    balance: "12,135.00",
  },

  "1 Month": {
    income: "23,262.00",
    expenses: "11,135.00",
    balance: "48,135.00",
  },

  "6 Months": {
    income: "86,450.00",
    expenses: "42,350.00",
    balance: "125,780.00",
  },

  "12 Months": {
    income: "168,920.00",
    expenses: "82,430.00",
    balance: "245,650.00",
  },

  All: {
    income: "425,620.00",
    expenses: "186,430.00",
    balance: "580,850.00",
  },
};

const filterOptions = [
  "7 Days",
  "1 Month",
  "6 Months",
  "12 Months",
  "All",
];

export default function SalesAnalytic() {
  const [filter, setFilter] = useState("1 Month");

  const chartData = useMemo(() => {
    return salesData[filter];
  }, [filter]);

  const stats = statsData[filter];

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
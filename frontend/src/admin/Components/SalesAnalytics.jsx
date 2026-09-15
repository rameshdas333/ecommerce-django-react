import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 3200 },
  { month: "Feb", sales: 4500 },
  { month: "Mar", sales: 3800 },
  { month: "Apr", sales: 5200 },
  { month: "May", sales: 4800 },
  { month: "Jun", sales: 6100 },
  { month: "Jul", sales: 5600 },
  { month: "Aug", sales: 7200 },
  { month: "Sep", sales: 6800 },
  { month: "Oct", sales: 7900 },
  { month: "Nov", sales: 7400 },
  { month: "Dec", sales: 8600 },
];

const SalesAnalytics = () => {
  return (
    <div className="w-full min-w-0 bg-white shadow-2xl border border-[#eeeeee] rounded-[4px] p-3 sm:p-4 lg:p-5">
      
      {/* Header */}
      <div className="flex flex-col xs:flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#333]">
            Sales Analytics
          </h2>

          <p className="text-[9px] sm:text-[10px] text-[#aaa] mt-1">
            Monthly sales overview
          </p>
        </div>

        <select
          className="
            w-full sm:w-auto
            text-[10px] sm:text-[11px]
            border border-[#eeeeee]
            rounded-[4px]
            px-2 py-1.5
            text-[#777]
            outline-none
            bg-white
          "
        >
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* Sales Summary */}
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-[20px] sm:text-[22px] font-bold text-[#222]">
            ৳68,450
          </h3>

          <span className="text-[9px] sm:text-[10px] font-medium text-[#55c99a]">
            ↑ 12.5%
          </span>
        </div>

        <p className="text-[9px] sm:text-[10px] text-[#aaa] mt-1">
          Compared to last month
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-[120px] sm:h-[140px] md:h-[150px] lg:h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{
              top: 5,
              right: 5,
              left: -20,
              bottom: 0,
            }}
          >
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
                  stopColor="#5fd6bd"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#5fd6bd"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#f1f1f1"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              tick={{
                fontSize: 9,
                fill: "#999",
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 9,
                fill: "#999",
              }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Sales",
              ]}
              contentStyle={{
                border: "1px solid #eeeeee",
                borderRadius: "4px",
                fontSize: "10px",
              }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#5fd6bd"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#5fd6bd",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAnalytics;
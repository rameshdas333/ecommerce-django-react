import React from "react";

import {
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiArrowUpRight,
} from "react-icons/fi";

const StatCard = ({ data, orderStatus }) => {
  const stats = [
    {
      title: "Total Revenue",
      value: `৳${Number(data?.total_sales || 0).toLocaleString()}`,
      change: "11%",
      icon: "৳",
    },

    {
      title: "Total Order",
      value: Number(data?.total_orders || 0).toLocaleString(),
      change: "11%",
      icon: FiShoppingBag,
    },

    {
      title: "Total Customer",
      value: Number(data?.total_customers || 0).toLocaleString(),
      change: "17%",
      icon: FiUsers,
    },

    {
      title: "Pending Delivery",
      value: Number(orderStatus?.pending || 0).toLocaleString(),
      change: "11%",
      icon: FiTruck,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-[#FFFFFF] shadow-2xl border border-[#eeeeee] rounded-[4px] p-4 sm:p-5 min-h-[125px] w-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] sm:text-[14px] text-black font-medium">
                  {item.title}
                </p>

                <p className="text-[10px] text-[#aaa] mt-1">
                  Last 30 days
                </p>
              </div>

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#edf9f6] flex items-center justify-center text-[#5fd6bd]">
                {typeof Icon === "string" ? (
                  <span className="text-[18px] font-bold">{Icon}</span>
                ) : (
                  <Icon size={17} />
                )}
              </div>
            </div>

            <div className="flex items-end justify-between mt-4">
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#222] leading-none">
                {item.value}
              </h2>

              <div className="flex items-center gap-1 text-[#55c99a] text-[10px] font-medium">
                <FiArrowUpRight size={12} />
                {item.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;
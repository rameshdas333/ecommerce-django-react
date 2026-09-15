import React from "react";
import { FiTarget, FiArrowUpRight } from "react-icons/fi";

const SalesTarget = () => {
  const target = 75;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (target / 100) * circumference;

  return (
    <div className="w-full min-w-0 bg-white shadow-2xl border border-[#eeeeee] rounded-[4px] p-3 sm:p-4 lg:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#333] truncate">
            Sales Target
          </h2>

          <p className="text-[9px] sm:text-[10px] text-[#aaa] mt-1">
            Monthly target progress
          </p>
        </div>

        <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#edf9f6] flex items-center justify-center text-[#5fd6bd]">
          <FiTarget size={15} className="sm:hidden" />
          <FiTarget size={17} className="hidden sm:block" />
        </div>
      </div>

      {/* Target Circle */}
      <div className="flex flex-col items-center justify-center mt-4 sm:mt-5">
        <div className="relative w-full w-[120px] sm:w-[135px] lg:w-[145px] h-[120px] sm:h-[140px] md:h-[150px] lg:h-[160px]">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#edf2f1"
              strokeWidth="9"
            />

            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#5fd6bd"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              className="transition-all duration-700"
            />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[23px] sm:text-[26px] lg:text-[28px] font-bold text-[#222] leading-none">
              {target}%
            </span>

            <span className="text-[9px] sm:text-[10px] text-[#999] mt-1">
              Completed
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <span className="text-[17px] sm:text-[18px] font-bold text-[#222]">
            ৳75,000
          </span>

          <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-[#55c99a]">
            <FiArrowUpRight size={11} />
            12.5%
          </span>
        </div>

        <p className="text-[9px] sm:text-[10px] text-[#aaa] mt-1 text-center">
          Target: $100,000
        </p>
      </div>
    </div>
  );
};

export default SalesTarget;
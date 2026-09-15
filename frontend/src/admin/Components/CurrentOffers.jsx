import React from "react";

const offers = [
  {
    title: "20% Discount Offer",
    expiry: "Expire on: 05-06-2025",
    progress: 72,
  },
  {
    title: "100 Taka Coupon",
    expiry: "Expire on: 10-06-2025",
    progress: 55,
  },
  {
    title: "Stock Out Sell",
    expiry: "Upcoming on: 15-06-2025",
    progress: 42,
  },
];

const CurrentOffers = () => {
  return (
    <div className="w-full min-w-0 bg-white shadow-2xl border border-[#eeeeee] rounded-[4px] p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#333]">
          Current Offer
        </h2>

        <button className="text-[10px] text-[#999] hover:text-[#55c99a] transition">
          View All
        </button>
      </div>

      {/* Offers */}
      <div className="space-y-5">
        {offers.map((offer) => (
          <div key={offer.title}>
            {/* Offer title + expiry */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-[10px] sm:text-[11px] font-medium text-[#333] truncate">
                {offer.title}
              </h3>

              <span className="shrink-0 text-[8px] sm:text-[9px] text-[#aaa]">
                {offer.expiry}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-[8px] sm:h-[9px] bg-[#eef1f0] rounded-[1px] overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-[1px] transition-all duration-500"
                style={{ width: `${offer.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentOffers;

import React from "react";
import StatCard from "../Components/StatCard";
import SalesAnalytics from "../Components/SalesAnalytics";
import SalesTarget from "../Components/SalesTarget";
import TopSellingProducts from "../Components/TopSellingProducts";
import CurrentOffers from "../Components/CurrentOffers";

const AdminDashboard = () => {
  return (
    <div className="w-full pt-4 sm:pt-4 md:pt-5   lg:pt-6 sm:space-y-6">

     

      {/* Stat Cards */}
      <section className="w-full">
        <StatCard />
      </section>

      {/* Sales Analytics + Sales Target */}
   <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full mt-5">
        <div className="xl:col-span-2 min-w-0">
          <SalesAnalytics />
        </div>

        <div className="min-w-0">
          <SalesTarget />
        </div>
      </section>

      {/* Top Products + Current Offers */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
        <div className="xl:col-span-2 min-w-0">
          <TopSellingProducts />
        </div>

        <div className="min-w-0">
          <CurrentOffers />
        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;
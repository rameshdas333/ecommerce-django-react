import React, { useEffect, useState } from "react";
import axios from "axios";

import StatCard from "../Components/StatCard";
import SalesAnalytics from "../Components/SalesAnalytics";
import SalesTarget from "../Components/SalesTarget";
import TopSellingProducts from "../Components/TopSellingProducts";
import CurrentOffers from "../Components/CurrentOffers";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = (
    import.meta.env.VITE_DJANGO_BASE_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        console.log("Access Token:", accessToken);

        if (!accessToken) {
          console.error("No access token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Dashboard Response:", response.data);

        setDashboardData(response.data);
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error.response?.status,
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-4 sm:pt-4 md:pt-5 lg:pt-6 sm:space-y-6">

      <section className="w-full">
        <StatCard data={dashboardData?.stats} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full mt-5">

        <div className="xl:col-span-2 min-w-0">
          <SalesAnalytics
            data={dashboardData?.sales_analytics}
          />
        </div>

        <div className="min-w-0">
          <SalesTarget />
        </div>

      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">

        <div className="xl:col-span-2 min-w-0">
          <TopSellingProducts
            data={dashboardData?.top_selling_products}
          />
        </div>

        <div className="min-w-0">
          <CurrentOffers />
        </div>

      </section>

    </div>
  );
};

export default AdminDashboard;
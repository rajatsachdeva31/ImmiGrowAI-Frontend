"use client";

import ConsultantCarousel from "@/components/consultant/ConsultantCarousel";
import SideCard from "@/components/Sidecard";
import React, { useEffect, useState } from "react";

const services = [
  "Dashboard",
  "Explore Homes",
  "Explore Cars",
  "Book Mentorship",
  "Bookings",
];
const urls = [
  "/dashboard/user",
  "/dashboard/user/homes",
  "/dashboard/user/cars",
  "/dashboard/user/consultant",
  "/dashboard/user/bookings",
];
const ConsultantPage = () => {
  const [consultanatListings, setConsultanatListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL;

        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;
        if (!token) throw new Error("Invalid authentication token");

        const consultantResponse = await fetch(
          `${endpoint}api/protected/consultants/view-consultant`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!consultantResponse.ok)
          throw new Error("Failed to fetch car listings");

        const consultantData = await consultantResponse.json();
        setConsultanatListings(consultantData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Mentors</h2>
          {/* <ReusableFilter filtersConfig={carFiltersConfig} onFilterChange={handleFilterChange} /> */}
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && consultanatListings && (
          <ConsultantCarousel
            consultants={consultanatListings.consultants || []}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultantPage;

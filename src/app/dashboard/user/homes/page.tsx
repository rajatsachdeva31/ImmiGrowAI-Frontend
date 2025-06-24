"use client";

import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import ReusableFilter from "@/components/Filter";
import React, { useEffect, useState } from "react";

const services = [
  "Dashboard",
  "Explore Homes",
  "Explore Cars",
  "Book Consultation",
  "Bookings",
];
const urls = [
  "/dashboard/user",
  "/dashboard/user/homes",
  "/dashboard/user/cars",
  "/dashboard/user/consultant",
  "/dashboard/user/bookings",
];
const HousesListing = () => {
  const [houseListings, setHouseListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
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

        const houseResponse = await fetch(
          `${endpoint}api/protected/house-listing/all-house-listing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!houseResponse.ok)
          throw new Error("Failed to fetch house listings");

        const houseData = await houseResponse.json();
        setHouseListings(houseData);
        setFilteredListings(houseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleFilterChange = (filters: Record<string, string>) => {
    const filtered = houseListings.filter((house) => {
      const openHouseValue = house.openhouse ? "Yes" : "No"; // Convert boolean to string

      return (
        (!filters.location ||
          house.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.price || house.price <= parseFloat(filters.price)) &&
        (!filters.openHouse || openHouseValue === filters.openHouse)
      );
    });

    setFilteredListings(filtered.slice());
  };
  
  // Debugging UI Update
  useEffect(() => {
  }, [filteredListings]);

  


  const houseFiltersConfig = [
    { name: "location", type: "text", placeholder: "Location (e.g. Toronto)" },
    { name: "price", type: "number", placeholder: "Max Price" },
    {
      name: "openHouse",
      type: "select",
      placeholder: "Open-House",
      options: ["Yes", "No"],
    },
  ];

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Houses Listing</h2>
          <ReusableFilter
            filtersConfig={houseFiltersConfig}
            onFilterChange={handleFilterChange}
          />
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && filteredListings.length > 0 ? (
          <Listings listings={filteredListings} />
        ) : (
          <p>No houses found.</p>
        )}
      </div>
    </div>
  );
};

export default HousesListing;

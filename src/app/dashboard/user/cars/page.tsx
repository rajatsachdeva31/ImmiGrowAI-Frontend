"use client";

import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import ReusableFilter from "@/components/Filter";
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
const CarsListing = () => {
  const [carListings, setCarListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

        const carResponse = await fetch(
          `${endpoint}api/protected/car-listing/all-car-listing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!carResponse.ok) throw new Error("Failed to fetch car listings");

        const carData = await carResponse.json();
        setCarListings(carData);
        setFilteredListings(carData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
  const handleFilterChange = (filters: Record<string, string>) => {
    const filtered = carListings.filter((car) => {
      return (
        (!filters.make ||
          car.make?.toLowerCase().includes(filters.make.toLowerCase())) &&
        (!filters.model ||
          car.model?.toLowerCase().includes(filters.model.toLowerCase())) &&
        (!filters.price || car.price <= parseFloat(filters.price))
      );
    });

    setFilteredListings(filtered.slice());
  };

  // Debugging UI Update
  useEffect(() => {}, [filteredListings]);

  const carFiltersConfig = [
    { name: "make", type: "text", placeholder: "Make (e.g. Toyota)" },
    { name: "model", type: "text", placeholder: "Model (e.g. Corolla)" },
    { name: "price", type: "number", placeholder: "Max Price" },
  ];

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Cars Listing</h2>
          <ReusableFilter
            filtersConfig={carFiltersConfig}
            onFilterChange={handleFilterChange}
          />
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && filteredListings.length > 0 ? (
          <Listings key={refresh} listings={filteredListings} />
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
};

export default CarsListing;

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

const FavouriteHouse = () => {
  const [houseListings, setHouseListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL;

        const tokenRes = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenRes.ok) throw new Error("Failed to get authentication token");

        const { token } = await tokenRes.json();
        if (!token) throw new Error("Invalid token");

        const response = await fetch(
          `${endpoint}api/protected/house-listing/favourites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch favourite houses");

        const data = await response.json();
        setHouseListings(data);
        setFilteredListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleFilterChange = (filters: Record<string, string>) => {
    const filtered = houseListings.filter((house) => {
      const openHouseValue = house.openhouse ? "Yes" : "No";

      return (
        (!filters.location ||
          house.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.price || house.price <= parseFloat(filters.price)) &&
        (!filters.openHouse || openHouseValue === filters.openHouse)
      );
    });

    setFilteredListings(filtered);
  };

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
    <div>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 mt-4">Favourite Houses</h2>
        <ReusableFilter
          filtersConfig={houseFiltersConfig}
          onFilterChange={handleFilterChange}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && filteredListings.length > 0 ? (
        <Listings listings={filteredListings} />
      ) : (
        <p>No favourite houses found.</p>
      )}
    </div>
  );
};

export default FavouriteHouse;

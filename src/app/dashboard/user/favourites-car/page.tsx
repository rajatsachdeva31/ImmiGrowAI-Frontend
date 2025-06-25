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

const FavouriteCars = () => {
  const [carListings, setCarListings] = useState([]);
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
        if (!tokenRes.ok) throw new Error("Failed to get token");

        const { token } = await tokenRes.json();
        if (!token) throw new Error("Token missing");

        const carRes = await fetch(
          `${endpoint}api/protected/car-listing/favourites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!carRes.ok) throw new Error("Failed to fetch favourite cars");

        const data = await carRes.json();
        setCarListings(data);
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

  const carFiltersConfig = [
    { name: "make", type: "text" as const, placeholder: "Make (e.g. Toyota)" },
    {
      name: "model",
      type: "text" as const,
      placeholder: "Model (e.g. Corolla)",
    },
    { name: "price", type: "number" as const, placeholder: "Max Price" },
  ];

  return (
    <div>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 mt-4">Favourite Cars</h2>
        <ReusableFilter
          filtersConfig={carFiltersConfig}
          onFilterChange={handleFilterChange}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && filteredListings.length > 0 ? (
        <Listings listings={filteredListings} />
      ) : (
        <p>No favourite cars found.</p>
      )}
    </div>
  );
};

export default FavouriteCars;

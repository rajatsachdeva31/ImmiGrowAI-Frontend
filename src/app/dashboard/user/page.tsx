"use client";

import QuickLinks from "@/components/QuickLinks";
import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import AIFeaturesPanel from "@/components/ai/AIFeaturesPanel";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [carListings, setCarListings] = useState(null);
  const [houseListings, setHouseListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL;

        // Fetch token
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token");
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;

        if (!token) {
          throw new Error("Invalid authentication token");
        }

        // Fetch house listings
        const houseResponse = await fetch(
          `${endpoint}api/protected/house-listing/all-house-listing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!houseResponse.ok) {
          throw new Error("Failed to fetch house listings");
        }

        const houseData = await houseResponse.json();
        setHouseListings(houseData);

        // Fetch car listings
        const carResponse = await fetch(
          `${endpoint}api/protected/car-listing/all-car-listing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!carResponse.ok) {
          throw new Error("Failed to fetch car listings");
        }

        const carData = await carResponse.json();
        setCarListings(carData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const services = [
    "Dashboard",
    "AI Assistant",
    "Explore Homes",
    "Explore Cars",
    "Book Mentorship",
    "Bookings",
  ];
  const urls = [
    "/dashboard/user",
    "/dashboard/user/ai",
    "/dashboard/user/homes",
    "/dashboard/user/cars",
    "/dashboard/user/consultant",
    "/dashboard/user/bookings",
  ];

  return (
    <div className="grid grid-cols-12 h-full">
      {" "}
      {/* h-screen for full viewport height */}
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        {" "}
        {/* Fixed SideCard */}
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">User Dashboard</h2>
          <QuickLinks
            links={[
              { label: "AI Assistant", href: "/dashboard/user/ai" },
              { label: "Profile Settings", href: "/dashboard/user/profile" },
              { label: "Saved Listings", href: "/dashboard/user/saved" },
              { label: "Booking History", href: "/dashboard/user/bookings" },
            ]}
          />
          
          {/* AI Features Section */}
          <div className="mb-8">
            <AIFeaturesPanel />
          </div>
          <h2 className="text-2xl font-bold mb-6 mt-4">
            Explore recent home listings
          </h2>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && houseListings && (
            <Listings listings={houseListings} />
          )}
          <h2 className="text-2xl font-bold mb-6 mt-4">
            Explore recent car listings
          </h2>
          {!loading && !error && carListings && (
            <Listings listings={carListings} />
          )}
        </div>
      </div>
    </div>
  );
}

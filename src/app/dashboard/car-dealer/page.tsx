"use client";

import QuickLinks from "@/components/QuickLinks";
import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = ["Dashboard", "Listings","Availability", "Bookings"];
  const urls = ["/dashboard/car-dealer", "/dashboard/car-dealer/car-listings/", "/dashboard/car-dealer/availability/", "/dashboard/car-dealer/bookings/"];

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

        // Fetch car listings
        const response = await fetch(
          `${endpoint}api/protected/car-listing/by-id-car-listing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 404) {
          throw new Error("No listing found");
        }
        

        const data = await response.json();
        setListings(data);
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
        <SideCard services={services} title="Links" urls={urls}/>
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Car Dealer Dashboard</h2>
          <QuickLinks links={[
            { label: "Add Listing", href: "car-dealer/add-listing" },
            { label: "View Listings", href: "car-dealer/car-listings" },
            { label: "Requests", href: "car-dealer/availability" },
          ]} />
          <h2 className="text-2xl font-bold mb-6 mt-5">View added listings</h2>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && listings && <Listings listings={listings} />}
        </div>
      </div>
    </div>
  );
}

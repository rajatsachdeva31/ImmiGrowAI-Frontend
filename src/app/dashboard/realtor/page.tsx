'use client';

import QuickLinks from "@/components/QuickLinks";
import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = ["Dashboard", "Listings", "Availability","Bookings"];
const urls = ["/dashboard/realtor", "/dashboard/realtor/house-listings", "/dashboard/realtor/availability", "/dashboard/realtor/bookings"];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL;

        // Fetch token
        const tokenResponse = await fetch(`${endpoint}auth/token`, { credentials: 'include' });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get authentication token');
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;

        if (!token) {
          throw new Error('Invalid authentication token');
        }

        // Fetch house listings
        const response = await fetch(`${endpoint}api/protected/house-listing/by-id-house-listing`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch house listings');
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
    <div className="grid grid-cols-12 h-screen"> {/* h-screen for full viewport height */}
      <div className="col-span-12 md:col-span-3 mt-3 p-3"> {/* Fixed SideCard */}
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Realtor Dashboard</h2>
          <QuickLinks links={[
            { label: "Add Listing", href: "realtor/add-listing" },
            { label: "View Listings", href: "realtor/house-listings" },
            { label: "Requests", href: "realtor/availability" },
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
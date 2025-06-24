"use client";

import QuickLinks from "@/components/QuickLinks";
import SideCard from "@/components/Sidecard";
import UpcomingConsultantMeetings from "@/components/consultant/UpcomingMeetings";
// import { useEffect, useState } from "react";

export default function DashboardLayout() {

  const services = ["Dashboard", "Availability", "Bookings"];
  const urls = ["/dashboard/consultant", "/dashboard/consultant/availability", "/dashboard/consultant/bookings/"];

 
  //   const fetchListings = async () => {
  //     try {
  //       const endpoint = process.env.NEXT_PUBLIC_API_URL;

  //       // Fetch token
  //       const tokenResponse = await fetch(`${endpoint}auth/token`, {
  //         credentials: "include",
  //       });

  //       if (!tokenResponse.ok) {
  //         throw new Error("Failed to get authentication token");
  //       }

  //       const tokenData = await tokenResponse.json();
  //       const token = tokenData?.token;

  //       if (!token) {
  //         throw new Error("Invalid authentication token");
  //       }

  //       // Fetch car listings
  //       const response = await fetch(
  //         `${endpoint}api/protected/`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       if (response.status === 404) {
  //         throw new Error("No listing found");
  //       }
        

  //       const data = await response.json();
  //       setListings(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchListings();
  // }, []);

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Links" urls={urls}/>
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Immigration Consultant Dashboard</h2>
          <QuickLinks links={[
            { label: "Add Availability", href: "/dashboard/consultant/availability" },
            { label: "View Bookings", href: "/dashboard/consultant/bookings" },
          ]} />
          <h2 className="text-2xl font-bold mb-6 mt-5">Upcoming Meetings</h2>
          {/* {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && listings && <Listings listings={listings} />} */}
          <UpcomingConsultantMeetings/>
        </div>
      </div>
    </div>
  );
}

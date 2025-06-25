// /app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import SideCard from "@/components/Sidecard";
import UserProfile from "@/components/UserProfile";

interface UserData {
  fullName: string;
  DOB: string;
  phoneNo: string;
  email: string;
  alreadyInCanada?: boolean | null;
  statusInCanada?: string | null;
  countryOfOrigin?: string | null;
  currentLocation?: string | null;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token");
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;
        const response = await fetch(`${endpoint}api/protected/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!userData) {
    return <p className="text-center mt-10">No user data available</p>;
  }

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <UserProfile userData={userData} />;
      </div>
    </div>
  );
};

export default ProfilePage;

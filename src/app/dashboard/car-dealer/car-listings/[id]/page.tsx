"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiCalendar,
  FiDroplet,
  FiSettings,
  FiUsers,
  FiPhoneCall,
  FiMail,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import { MdSpeed, MdCarRental, MdFormatPaint } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";

const ViewCarListing = () => {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
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
          const role = tokenData?.role;
          if (!token) {
            throw new Error("Invalid authentication token");
          }
          setUserRole(role);

          // Fetch car listing
          const response = await fetch(
            `${endpoint}api/protected/car-listing/carlisting/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch car listing");
          }
          const data = await response.json();
          setListing(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this car listing?")) {
      try {
        const endpoint = process.env.NEXT_PUBLIC_API_URL;
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;
        if (!token) {
          throw new Error("Invalid authentication token");
        }
        const response = await fetch(
          `${endpoint}api/protected/car-listing/delete-car-listing/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete car listing");
        }
        alert("Car listing deleted successfully");
        router.push("/dashboard/car-dealer/car-listings");
      } catch (err: any) {
        alert(`Error deleting car listing: ${err.message}`);
      }
    }
  };

  // Helper functions to format dealership info
  const formatFinancingOptions = (optionsStr: string) => {
    return optionsStr
      .replace(/[{}"]/g, "")
      .split(",")
      .map((o) => o.trim());
  };

  const formatShowroomLocations = (locationsStr: string) => {
    return locationsStr.replace(/[{}"]/g, "");
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
  }
  if (!listing) {
    return (
      <p className="text-center text-gray-500 text-lg">No car listing found</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <Link href="/dashboard/car-dealer/car-listings">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <FiArrowLeft size={18} />
          Back to Listings
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Listing Card */}
        <div className="md:w-2/3">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {/* Image Carousel */}
              {listing.carImages && listing.carImages.length > 0 && (
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="w-full h-96 rounded-lg shadow-lg mb-6"
                >
                  {listing.carImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.base64}
                        alt={`Car Image ${index + 1}`}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              {/* Car Details */}
              <div className="mb-4">
                <h1 className="text-3xl font-semibold">
                  {listing.model} - {listing.make}
                </h1>
                {listing.createdAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Created At:{" "}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                )}
                <p className="text-2xl mt-2 text-blue-600 font-bold flex items-center gap-1">
                  <FiDollarSign size={24} />
                  {listing.price ?? "N/A"}
                </p>
              </div>
              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-1">
                  <FiCalendar size={20} />
                  <p className="text-lg font-semibold">
                    {listing.year ?? "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <MdSpeed size={20} />
                  <p className="text-lg font-semibold">
                    {listing.mileage ? `${listing.mileage} km` : "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FiSettings size={20} />
                  <p className="text-lg font-semibold">
                    {listing.transmission ?? "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FiDroplet size={20} />
                  <p className="text-lg font-semibold">
                    {listing.fuelType ?? "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FiUsers size={20} />
                  <p className="text-lg font-semibold">
                    {listing.noOfSeats ? `${listing.noOfSeats} Seats` : "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <MdFormatPaint size={20} />
                  <p className="text-lg font-semibold">
                    {listing.exteriorColor ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href={`/dashboard/car-dealer/edit-listing/${id}`}>
                  <Button variant="default" className="flex items-center gap-2">
                    <FiEdit size={18} />
                    Edit Listing
                  </Button>
                </Link>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <FiTrash2 size={18} />
                  Delete Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Separate Dealership Info Container */}
        {listing.dealership && (
          <div className="md:w-1/3">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Details: </h2>
                <div className="mb-3">
                  <p className="font-semibold">{listing.dealership.fullName}</p>
                </div>
                <div className="flex items-center mb-3">
                  <FiPhoneCall size={18} className="text-blue-500 mr-2" />
                  <p>{listing.dealership.phoneNo}</p>
                </div>
                <div className="flex items-center mb-3">
                  <FiMail size={18} className="text-blue-500 mr-2" />
                  <p>{listing.dealership.email}</p>
                </div>
                {listing.dealership.carDealership && (
                  <>
                    <div className="flex items-center mb-3">
                      <FiMapPin size={18} className="text-red-500 mr-2" />
                      <div>
                        <p className="text-lg">
                          {listing.dealership.carDealership.businessName}
                        </p>
                        <p className="text-lg">
                          {formatShowroomLocations(
                            listing.dealership.carDealership.showroomLocations
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <ul className="list-disc list-inside list-none">
                        {formatFinancingOptions(
                          listing.dealership.carDealership.financingOptions
                        ).map((option, idx) => (
                          <li key={idx} className="text-lg">
                            {option === "inHouseFinancing:true" &&
                              "🏠 In-House Financing"}
                            {option === "thirdPartyBanks:true" &&
                              "🏦 Third-Party Banks"}
                            {option === "leaseOptions:true" &&
                              "📄 Lease Options"}
                            {option === "inHouseFinancing:false" &&
                              "❌ No In-House Financing"}
                            {option === "thirdPartyBanks:false" &&
                              "❌ No Third-Party Banks"}
                            {option === "leaseOptions:false" &&
                              "❌ No Lease Options"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCarListing;

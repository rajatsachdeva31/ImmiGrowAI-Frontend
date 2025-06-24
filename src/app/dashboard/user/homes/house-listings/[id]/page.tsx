"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Swiper (Carousel)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

// Icons
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPhoneCall,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiHome,
  FiGlobe,
  FiDollarSign,
  FiHeart,
} from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";

const ViewListing = () => {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // Helper: Format dates.
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const checkIfAnyDateIsFuture = (data) => {
    // Get current UTC time
    const currentTime = new Date();

    // Use Array.some() to stop as soon as a future date is found
    const isFuture = data.some((item) => {
      // Validate if endDate exists and is a valid date
      if (!item.endDate) return false;

      // Convert endDate to a Date object
      const endDateUTC = new Date(item.endDate);

      // Check if endDate is valid and greater than currentTime
      return !isNaN(endDateUTC.getTime()) && endDateUTC > currentTime;
    });

    return isFuture;
  };

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          const endpoint = process.env.NEXT_PUBLIC_API_URL;
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
          const response = await fetch(
            `${endpoint}api/protected/house-listing/houselisting/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch listing");
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
    if (confirm("Are you sure you want to delete this listing?")) {
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
          `${endpoint}api/protected/house-listing/delete-house-listing/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete listing");
        }
        alert("Listing deleted successfully");
        router.push("/dashboard/realtor/house-listings");
      } catch (err: any) {
        alert(`Error deleting listing: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
  }

  if (!listing) {
    return (
      <p className="text-center text-gray-500 text-lg">No listing found</p>
    );
  }

  const handleContactSeller = async (listingId: number, type: string) => {
    const tokenResponse = await fetch(`${endpoint}auth/token`, {
      credentials: "include",
    });
    if (!tokenResponse.ok) {
      throw new Error("Failed to get authentication token");
    }
    const tokenData = await tokenResponse.json();
    const token = tokenData?.token;
    const response = await fetch(
      `${endpoint}api/protected/appointment/booking-status?listingId=${listingId}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      if (checkIfAnyDateIsFuture(data.booking)) {
        alert("You have already booked an appointment with this seller");
      } else {
        alert("Action Pending from Realtor");
      }
    } else {
      router.push(`/dashboard/user/slots/${listingId}/${type}`);
    }
  };

  const handleSaveListing = async (listingId: number) => {
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData?.token;
      const response = await fetch(
        `${endpoint}api/protected/house-listing/add-to-favourites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listingId: listingId,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      {/* Back Button */}
      <Link href="/dashboard/user/">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <FiArrowLeft size={18} />
          Back to Listings
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Main Listing Card */}
        <div className="md:w-2/3">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {/* Image Carousel */}
              {listing.houseImages && listing.houseImages.length > 0 && (
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="w-full h-96 rounded-lg shadow-lg mb-6"
                >
                  {listing.houseImages.map((image: any, index: number) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.base64}
                        alt={`House Image ${index + 1}`}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Title, Price, and Created At */}
              <div className="mb-4">
                <h1 className="text-3xl font-semibold flex items-center gap-2">
                  {listing.title ?? "Untitled"}
                </h1>
                <p className="text-2xl mt-2 text-green-600 font-bold flex items-center gap-2">
                  <FiDollarSign size={24} />
                  {listing.price ?? "N/A"}
                </p>
                {listing.createdAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Created At:{" "}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Description */}
              {listing.description && (
                <p className="mb-4">{listing.description}</p>
              )}

              {/* House Attributes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {listing.bedrooms !== null && (
                  <div className="flex items-center gap-2">
                    <FaBed size={20} />
                    <p className="text-lg font-semibold">
                      {listing.bedrooms} Beds
                    </p>
                  </div>
                )}
                {listing.bathrooms !== null && (
                  <div className="flex items-center gap-2">
                    <FaBath size={20} />
                    <p className="text-lg font-semibold">
                      {listing.bathrooms} Baths
                    </p>
                  </div>
                )}
                {listing.squareFeet && (
                  <div className="flex items-center gap-2">
                    <FiHome size={20} />
                    <p className="text-lg font-semibold">
                      {listing.squareFeet} sq ft
                    </p>
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin size={40} />
                    <p className="text-sm font-semibold">{listing.location}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                {/* Public buttons */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleContactSeller(listing.id, "house")}
                >
                  <FiPhoneCall size={18} />
                  Contact Seller
                </Button>

                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => handleSaveListing(listing.id)}
                >
                  <FiHeart size={18} />
                  Save Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Landlord / Realtor Info Card */}
        {listing.landlord && (
          <div className="md:w-1/3">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact</h2>
                {listing.landlord.fullName && (
                  <p className="font-semibold mb-4">
                    {listing.landlord.fullName}
                  </p>
                )}
                {listing.landlord.phoneNo && (
                  <div className="flex items-center gap-2 mb-3">
                    <FiPhoneCall size={18} className="text-blue-500" />
                    <p>{listing.landlord.phoneNo}</p>
                  </div>
                )}
                {listing.landlord.email && (
                  <div className="flex items-center gap-2 mb-3">
                    <FiMail size={18} className="text-green-500" />
                    <p>{listing.landlord.email}</p>
                  </div>
                )}
                {listing.landlord.realtor && (
                  <>
                    <div className="flex items-center mb-3">
                      <FiMapPin size={18} className="text-red-500 mr-2" />
                      <p>
                        {listing.landlord.realtor.businessName},{" "}
                        {listing.landlord.realtor.businessAddress}
                      </p>
                    </div>
                    <div className="flex items-center mb-3">
                      <FiGlobe size={25} className="mr-2" />
                      <p>{listing.landlord.realtor.portfolioWebsite}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {listing.openhouse && (
              <Card className="shadow-lg mt-2">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Open House</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <FiCalendar size={18} />
                    <p className="text-">
                      Start Date: {formatDate(listing.startdate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiCalendar size={18} />
                    <p>End Date: {formatDate(listing.endDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock size={18} />
                    <p>Start Time: {listing.startTime ?? "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock size={18} />
                    <p>End Time: {listing.endTime ?? "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewListing;

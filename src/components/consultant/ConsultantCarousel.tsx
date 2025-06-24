"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const ConsultantCarousel = ({ consultants }) => {
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

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

  const openModal = (consultant) => {
    setSelectedConsultant(consultant);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedConsultant(null);
    setModalOpen(false);
  };

  if (!consultants || consultants.length === 0) {
    return <p className="text-gray-500">No consultants available.</p>;
  }

  const handleAvailability = async (consultantId: number, type: string) => {
    const tokenResponse = await fetch(`${endpoint}auth/token`, {
      credentials: "include",
    });
    if (!tokenResponse.ok) {
      throw new Error("Failed to get authentication token");
    }
    const tokenData = await tokenResponse.json();
    const token = tokenData?.token;
    const listingId = consultantId;
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
        alert("Action Pending from Consultant");
      }
    } else {
      router.push(`/dashboard/user/slots/consultant/${consultantId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {consultants.map((consultant) => (
        <div key={consultant.id} className="p-2">
          <div className="rounded-2xl overflow-hidden shadow-md bg-white text-center">
            {/* Top bar with gradient */}
            <div className="relative bg-gradient-to-r from-green-600 to-green-400 h-20 flex justify-center items-end rounded-t-2xl">
              {/* User Icon inside circle */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg -mb-8">
                <User className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Info below icon */}
            <div className="pt-10 px-4 pb-6">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                {consultant.user?.fullName || "Unknown Consultant"}
              </p>
              <p className="text-sm text-gray-600">
                {consultant.user?.email || "No email provided"}
              </p>
              <p className="text-xs text-gray-500 mt-1 italic">
                {(consultant.servicesOffered || "")
                  .split(",")
                  .map((s) => s.trim())
                  .join(" | ")}
              </p>

              <div className="mt-4 space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-500"
                  onClick={() => openModal(consultant)}
                >
                  View Details
                </Button>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500"
                  onClick={() =>
                    handleAvailability(consultant.user.id, "consultant")
                  }
                >
                  View Availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Consultant Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultant Info</DialogTitle>
          </DialogHeader>
          {selectedConsultant && (
            <div className="space-y-2">
              <p>
                <strong>Business Name:</strong>{" "}
                {selectedConsultant.businessName || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedConsultant.businessAddress || "N/A"}
              </p>
              <p>
                <strong>Experience:</strong>{" "}
                {selectedConsultant.yearsOfExperience || "N/A"} years
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {selectedConsultant.languagesSpoken || "N/A"}
              </p>
              <p>
                <strong>Website/Social:</strong>{" "}
                {selectedConsultant.websiteOrSocialMedia || "N/A"}
              </p>
              <p>
                <strong>Consultation Fee:</strong>{" "}
                {selectedConsultant.consultationFee
                  ? `$${selectedConsultant.consultationFee}`
                  : "N/A"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultantCarousel;

"use client";

import { useParams } from "next/navigation";
import AppointmentBooking from "@/components/availability/AppointmentBooking";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const AppointmentBookingCPage = () => {
  const params = useParams();
  const consultantId = params.consultantId as string;

  if (!consultantId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-lg">Invalid request. Missing parameters.</p>
        <Link href="/dashboard/user">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }
  const backLink =
   `/dashboard/user/consultant`

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      {/* Back Button */}
      
      <Link href={backLink}>
        <Button variant="ghost" className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900">
          <FiArrowLeft size={20} />
          <span className="font-medium">Back to Mentors</span>
        </Button>
      </Link>

      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📅 Book an Appointment</h1>
        <p className="text-gray-600 mt-2">Select a time slot to schedule your appointment.</p>
      </div>

      {/* Appointment Booking Component */}
      <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
        <AppointmentBooking listingId={consultantId} type={"consultant"} />
      </div>
    </div>
  );
};

export default AppointmentBookingCPage;

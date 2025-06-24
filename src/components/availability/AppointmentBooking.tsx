import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, CheckCircle } from "lucide-react";

interface Availability {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface AppointmentBookingProps {
  listingId: string;
  type: "car" | "house" | "consultant";
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  listingId,
  type,
}) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState<string | null>(
    null
  );

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Convert UTC to User's Timezone for Display
  const formatToUserTimezone = (utcDate: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(utcDate));
  };

  // ✅ Fetch Authentication Token Once
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        setAuthToken(tokenData.token);
      } catch (error) {
        setError("Authentication error. Please try again.");
      }
    };

    fetchToken();
  }, []);

  // ✅ Fetch Availability Slots
  const fetchAvailability = async () => {
    if (!authToken) return;

    setLoading(true);
    setError("");

    if (type === "consultant") {
      try {
        const response = await fetch(
          `${endpoint}api/protected/availability/consultant-availability/${listingId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch availability");

        const data: Availability[] = await response.json();
        setAvailability(data);
      } catch (error) {
        setError("Error fetching availability. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          `${endpoint}api/protected/availability/express-interest?type=${type}&listingId=${listingId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch availability");

        const data: Availability[] = await response.json();
        setAvailability(data);
      } catch (error) {
        setError("Error fetching availability. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authToken) fetchAvailability();
  }, [authToken, listingId, type]);

  // ✅ Handle Booking Appointment
  const handleBookAppointment = async (
    availabilityId: string,
    listingId: string
  ) => {
    if (!authToken) return;

    try {
      setSelectedSlot(availabilityId);

      const response = await fetch(
        `${endpoint}api/protected/appointment/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            listingId: parseInt(listingId),
            availabilityId: parseInt(availabilityId),
          }),
        }
      );

      const data = await response.json();

      if (
        data.error ===
        "Google Calendar access required. Please connect your Google account."
      ) {
        alert("Google Calendar access required. Redirecting...");
        window.open(data.connectUrl, "_blank"); // Open Google OAuth link
      } else if (data.appointment) {
        alert("✅ Appointment Scheduled! Check your Google Calendar.");
        setIsAppointmentBooked(availabilityId);
      } else {
        alert("Failed to schedule appointment.");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Error scheduling event.");
    }
  };

  return (
    <div className="mx-auto p-6">
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : availability.length === 0 ? (
        <p className="text-gray-500 text-center">
          No available slots at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availability.map((slot) => (
            <div
              key={slot.id}
              className={`p-5 border rounded-lg shadow-md flex flex-col ${
                selectedSlot === slot.id ? "bg-green-100" : "bg-white"
              } transition-transform hover:scale-105`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <CalendarClock className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Time Slot
                </h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-900 font-semibold">Start:</p>
                  <p className="text-gray-700">
                    {formatToUserTimezone(slot.startTime)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <p className="text-gray-900 font-semibold">End:</p>
                  <p className="text-gray-700">
                    {formatToUserTimezone(slot.endTime)}
                  </p>
                </div>
              </div>

              <Button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                onClick={() => handleBookAppointment(slot.id, listingId)}
                disabled={isAppointmentBooked === slot.id}
              >
                {isAppointmentBooked === slot.id ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Appointment Booked
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;

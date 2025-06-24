import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Booking {
  id: number;
  userId: number;
  listingId: number;
  startDate: string;
  endDate: string;
  status: string;
  meetLink?: string;
  createdAt: string;
  listing?: {
    id: number;
    title?: string;
    price?: string;
    location?: string;
    make?: string;
    model?: string;
    year?: number;
  };
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  role: string;
}

const BookingTable = () => {
  const [houseBookings, setHouseBookings] = useState<Booking[]>([]);
  const [carBookings, setCarBookings] = useState<Booking[]>([]);
  const [icBookings, setIcBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<{
    type: "user" | "listing";
    data: any;
  } | null>(null);
  let id = 1;

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        const response = await fetch(
          `${endpoint}api/protected/appointment/user-info`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (data.success) {
          setHouseBookings(data.houseBookings || []);
          setCarBookings(data.carBookings || []);
          setIcBookings(data.icBookings || []);
          id = 1;
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const markAsComplete = async (
    id: number,
    type: "house" | "car" | "consultant"
  ) => {
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
      const res = await fetch(`${endpoint}api/protected/appointment/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, type }),
      });

      if (res.ok) {
        id = 1;
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

      {/* House Bookings */}

      {houseBookings.length > 0 && (
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Listing</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {houseBookings.map((booking) => (
                <tr key={booking.id} className="border">
                  <td className="border p-2 text-center">{id++}</td>
                  <td className="border p-2 text-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        setModalData({ type: "user", data: booking.user })
                      }
                    >
                      View User
                    </Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        setModalData({ type: "listing", data: booking.listing })
                      }
                    >
                      View Listing
                    </Button>
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.startDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.endDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">{booking.status}</td>
                  <td className="border p-2 text-center">
                    {booking.status !== "completed" && (
                      <Button
                        onClick={() => markAsComplete(booking.id, "house")}
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {carBookings.length > 0 && (
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Listing</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carBookings.map((booking) => (
                <tr key={booking.id} className="border">
                  <td className="border p-2 text-center">{id++}</td>
                  <td className="border p-2 text-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        setModalData({ type: "user", data: booking.user })
                      }
                    >
                      View User
                    </Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        setModalData({ type: "listing", data: booking.listing })
                      }
                    >
                      View Listing
                    </Button>
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.startDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.endDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">{booking.status}</td>
                  <td className="border p-2 text-center">
                    {booking.status !== "completed" && (
                      <Button
                        onClick={() => markAsComplete(booking.id, "car")}
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {icBookings.length > 0 && (
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {icBookings.map((booking) => (
                <tr key={booking.id} className="border">
                  <td className="border p-2 text-center">{id++}</td>
                  <td className="border p-2 text-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        setModalData({ type: "user", data: booking.user })
                      }
                    >
                      View User
                    </Button>
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.startDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(booking.endDate).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">{booking.status}</td>
                  <td className="border p-2 text-center">
                    {booking.status !== "completed" && (
                      <Button
                        onClick={() => markAsComplete(booking.id, "consultant")}
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {houseBookings.length === 0 &&
        carBookings.length === 0 &&
        icBookings.length === 0 && (
          <div className="text-center p-4">No bookings found</div>
        )}
      {/* Modal for viewing details */}
      {modalData && (
        <Dialog open={!!modalData} onOpenChange={() => setModalData(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalData.type === "user" ? "User Details" : "Listing Details"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-gray-100 rounded">
              {modalData.type === "user" ? (
                <>
                  <p>
                    <strong>Full Name:</strong> {modalData.data.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {modalData.data.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {modalData.data.phoneNo}
                  </p>
                </>
              ) : (
                <>
                  {modalData.data.title && (
                    <p>
                      <strong>Title:</strong> {modalData.data.title}
                    </p>
                  )}
                  {modalData.data.price && (
                    <p>
                      <strong>Price:</strong> {modalData.data.price}
                    </p>
                  )}
                  {modalData.data.location && (
                    <p>
                      <strong>Location:</strong> {modalData.data.location}
                    </p>
                  )}
                  {modalData.data.make && (
                    <p>
                      <strong>Make:</strong> {modalData.data.make}
                    </p>
                  )}
                  {modalData.data.model && (
                    <p>
                      <strong>Model:</strong> {modalData.data.model}
                    </p>
                  )}
                  {modalData.data.year && (
                    <p>
                      <strong>Year:</strong> {modalData.data.year}
                    </p>
                  )}
                </>
              )}
            </div>
            <DialogClose asChild>
              <Button className="mt-2">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookingTable;

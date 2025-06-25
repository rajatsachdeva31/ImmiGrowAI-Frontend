import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Listing {
  id: number;
  title?: string;
  price?: string;
  location?: string;
  make?: string;
  model?: string;
  year?: number;
}

interface Booking {
  id: number;
  userId: number;
  listingId: number;
  startDate: string;
  endDate: string;
  status: string;
  meetLink?: string;
  createdAt: string;
  listing?: Listing;
  user?: {
    id: number;
    fullName: string;
    email: string;
    phoneNo: string;
  };
}

interface ConsultantBooking {
  id: number;
  consultantId: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: string;
  meetLink: string;
  consultant: {
    fullName: string;
    email: string;
    phoneNo: string;
  };
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  role: string;
}

const BookingView = () => {
  const [houseBookings, setHouseBookings] = useState<Booking[]>([]);
  const [carBookings, setCarBookings] = useState<Booking[]>([]);
  const [consultantBookings, setConsultantBookings] = useState<ConsultantBooking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<{ type: "user" | "listing" | "consultant"; data: any } | null>(null);

  const endpoint = process.env.NEXT_PUBLIC_API_URL;
  let id = 0;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, { credentials: "include" });
        if (!tokenResponse.ok) throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        // House & Car Bookings
        const response = await fetch(`${endpoint}api/protected/appointment/view-booking`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          setHouseBookings(data.houseBookings || []);
          setCarBookings(data.carBookings || []);
        }

        // Consultant Bookings
        const consultantRes = await fetch(`${endpoint}api/protected/appointment/view-Cbooking`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const consultantData = await consultantRes.json();
        if (Array.isArray(consultantData)) {
          setConsultantBookings(consultantData);
        }

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

      <Tabs defaultValue="house">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="house">House Bookings</TabsTrigger>
          <TabsTrigger value="car">Car Bookings</TabsTrigger>
          <TabsTrigger value="consultant">Mentor Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="house">
          {houseBookings.length > 0 ? (
            <TableComponent data={houseBookings} id ={1} type="house" onViewDetails={setModalData} />
          ) : (
            <p>No house bookings found.</p>
          )}
        </TabsContent>

        <TabsContent value="car">
          {carBookings.length > 0 ? (
            <TableComponent data={carBookings}  id ={1}  type="car" onViewDetails={setModalData} />
          ) : (
            <p>No car bookings found.</p>
          )}
        </TabsContent>

        <TabsContent value="consultant">
          {consultantBookings.length > 0 ? (
            <TableComponent data={consultantBookings}  id ={1}  type="consultant" onViewDetails={setModalData} />
          ) : (
            <p>No consultant bookings found.</p>
          )}
        </TabsContent>
      </Tabs>

      {modalData && (
        <Dialog open={!!modalData} onOpenChange={() => setModalData(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalData.type === "user"
                  ? "User Details"
                  : modalData.type === "listing"
                  ? "Listing Details"
                  : "Mentor Details"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-gray-100 rounded">
              {modalData.type === "consultant" ? (
                <>
                  <p><strong>Full Name:</strong> {modalData.data.fullName}</p>
                  <p><strong>Email:</strong> {modalData.data.email}</p>
                  <p><strong>Phone:</strong> {modalData.data.phoneNo}</p>
                </>
              ) : modalData.type === "user" ? (
                modalData.data.listing?.landlord || modalData.data.listing?.dealership ? (
                  <>
                    <p><strong>Full Name:</strong> {modalData.data.listing.landlord?.fullName || modalData.data.listing.dealership?.fullName}</p>
                    <p><strong>Email:</strong> {modalData.data.listing.landlord?.email || modalData.data.listing.dealership?.email}</p>
                    <p><strong>Phone:</strong> {modalData.data.listing.landlord?.phoneNo || modalData.data.listing.dealership?.phoneNo}</p>
                  </>
                ) : (
                  <p>No landlord or dealership information available.</p>
                )
              ) : (
                <>
                  {modalData.data.title && <p><strong>Title:</strong> {modalData.data.title}</p>}
                  {modalData.data.price && <p><strong>Price:</strong> {modalData.data.price}</p>}
                  {modalData.data.location && <p><strong>Location:</strong> {modalData.data.location}</p>}
                  {modalData.data.make && <p><strong>Make:</strong> {modalData.data.make}</p>}
                  {modalData.data.model && <p><strong>Model:</strong> {modalData.data.model}</p>}
                  {modalData.data.year && <p><strong>Year:</strong> {modalData.data.year}</p>}
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

const TableComponent = ({
  data,
  type,
  id,
  onViewDetails,
}: {
  data: any[];
  type: "house" | "car" | "consultant";
  id: number,
  onViewDetails: (data: { type: "user" | "listing" | "consultant"; data: any }) => void;
}) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">ID</th>
          {type === "consultant" ? <th className="border p-2">Mentor</th> : <>
            <th className="border p-2">User</th>
            <th className="border p-2">Listing</th>
          </>}
          <th className="border p-2">Start Date</th>
          <th className="border p-2">End Date</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((booking) => (
          <tr key={booking.id} className="border">
            <td className="border p-2 text-center">{id++}</td>
            {type === "consultant" ? (
              <td className="border p-2 text-center">
                <Button variant="link" onClick={() => onViewDetails({ type: "consultant", data: booking.consultant })}>
                  View Mentor
                </Button>
              </td>
            ) : (
              <>
                <td className="border p-2 text-center">
                  <Button variant="link" onClick={() => onViewDetails({ type: "user", data: booking })}>
                    View User
                  </Button>
                </td>
                <td className="border p-2 text-center">
                  <Button variant="link" onClick={() => onViewDetails({ type: "listing", data: booking.listing })}>
                    View Listing
                  </Button>
                </td>
              </>
            )}
            <td className="border p-2 text-center">{new Date(booking.startDate).toLocaleString()}</td>
            <td className="border p-2 text-center">{new Date(booking.endDate).toLocaleString()}</td>
            <td className="border p-2 text-center">{booking.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingView;

"use client";

import SideCard from "@/components/Sidecard";
import BookingView from "@/components/availability/UserBooking";

const services = [
  "Dashboard",
  "Explore Homes",
  "Explore Cars",
  "Book Consultation",
  "Bookings"
];
const urls = [
  "/dashboard/user",
  "/dashboard/user/homes",
  "/dashboard/user/cars",
  "/dashboard/user/consultant",
  "/dashboard/user/bookings"
];
const UserBooking = () => {
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        
        
          <BookingView />
      </div>
    </div>
  );
};

export default UserBooking;

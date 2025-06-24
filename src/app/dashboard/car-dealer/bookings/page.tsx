"use client";
import BookingTable from "@/components/availability/BookingTable";
import SideCard from "@/components/Sidecard";

const services = ["Dashboard", "Listings","Availability", "Bookings"];
  const urls = ["/dashboard/car-dealer", "/dashboard/car-dealer/car-listings/", "/dashboard/car-dealer/availability/", "/dashboard/car-dealer/bookings/"];


const CarBooking = () => {
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        
        
          <BookingTable />
      </div>
    </div>
  );
};

export default CarBooking;
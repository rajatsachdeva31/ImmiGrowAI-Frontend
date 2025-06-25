"use client";

import Listings from "@/components/Listings";
import SideCard from "@/components/Sidecard";
import ReusableFilter from "@/components/Filter";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavouriteCars from "../favourites-car/page";
import FavouriteHouse from "../favourites-house/page";

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

const Saved = () => {
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Services" urls={urls} />
      </div>
      <div className="col-span-12 md:col-span-9 p-5">
        <Tabs defaultValue="account" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
          </TabsList>
          <TabsContent value="cars">
            <FavouriteCars />
          </TabsContent>
          <TabsContent value="houses">
            <FavouriteHouse />
          </TabsContent>
          <TabsContent value="consultants">No Saved Mentor</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Saved;

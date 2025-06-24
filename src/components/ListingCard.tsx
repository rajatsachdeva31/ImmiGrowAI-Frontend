"use client";

import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bed, Bath, Clock, MapPin, DollarSign, Calendar } from "lucide-react";
import { TbBrandSpeedtest } from "react-icons/tb";

export default function ListingCard({ listing }) {
  const {
    id,
    title,
    location,
    price,
    houseImages,
    carImages,
    bedrooms,
    bathrooms,
    createdAt,
    make, // Used to determine car listing
    model,
    mileage,
    year,
  } = listing;

  const router = useRouter();
  const pathname = usePathname();

  const isCarListing = Boolean(make); // Check if the listing is a car
  const isHouseListing = Boolean(houseImages && houseImages.length > 0);

  const getSlicedPathname = (pathname: string) => {
    const pathArray = pathname.split("/");

    if (pathArray[1] === "dashboard" && pathArray[2] === "user") {
      return isCarListing
        ? `/${pathArray[1]}/${pathArray[2]}/cars`
        : `/${pathArray[1]}/${pathArray[2]}/homes`;
    }

    if (
      pathArray[1] === "dashboard" &&
      (pathArray[2] === "realtor" || pathArray[2] === "car-dealer")
    ) {
      return `/${pathArray[1]}/${pathArray[2]}`;
    }

    return pathArray.slice(0, pathArray.length - 1).join("/");
  };

  const handleCardClick = () => {
    if (isHouseListing) {
      router.push(`${getSlicedPathname(pathname)}/house-listings/${id}`);
    }
    if (isCarListing) {
      router.push(`${getSlicedPathname(pathname)}/car-listings/${id}`);
    }
  };

  return (
    <Card
      className="sm:w-full h-full border rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md transition flex"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="w-1/3">
        {isHouseListing && (
          <img
            src={houseImages[0].base64}
            alt="House"
            className="w-full h-full object-cover rounded-l-lg"
          />
        )}
        {isCarListing && carImages?.length > 0 && (
          <img
            src={carImages[0].base64}
            alt="Car"
            className="w-full h-full object-cover rounded-l-lg"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-2/3 p-2 flex flex-col justify-between">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            {title && (
              <p className="text-xl font-bold truncate w-30">{title}</p>
            )}
            {make && model && (
              <p className="text-xl font-bold">
                {model} {make}
              </p>
            )}
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-blue-600 flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
            {price.toLocaleString()}
          </p>

          {/* Location (Visible Only for Houses) */}
          {isHouseListing && (
            <p className="text-sm font-medium text-gray-700 flex items-start  gap-2">
              <MapPin size={20} />
              <span className="truncate w-50">{location}</span>
            </p>
          )}
          {isCarListing && (
            <p className="text-sm font-medium text-gray-700 flex items-start  gap-2">
              <Calendar size={20} />
              {year}
            </p>
          )}
        </CardHeader>

        {/* Features (House: Bedrooms & Bathrooms | Car: Just an Icon) */}
        <CardContent className="p-0 flex items-center space-x-4 text-gray-600 text-sm mt-2">
          {isHouseListing && bedrooms !== undefined && (
            <span className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {bedrooms}
            </span>
          )}
          {isHouseListing && bathrooms !== undefined && (
            <span className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {bathrooms}
            </span>
          )}
          {isCarListing && (
            <span className="flex items-center">
              <TbBrandSpeedtest className="h-4 w-4 mr-1" /> {mileage}
            </span>
          )}
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {createdAt ? new Date(createdAt).toDateString() : "Just now"}
          </span>
        </CardContent>
      </div>
    </Card>
  );
}

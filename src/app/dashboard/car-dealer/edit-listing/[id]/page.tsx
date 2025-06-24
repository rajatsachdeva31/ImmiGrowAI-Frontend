"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const EditCarListing = () => {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    model: "",
    make: "",
    price: "",
    year: "",
    mileage: "",
    exteriorColor: "",
    interiorColor: "",
    transmission: "",
    fuelType: "",
    vin: "",
    vehicleType: "",
    noOfSeats: "",
    status: "",
  });

  // existingImages will contain both server images (as base64) and previews for newly added images.
  const [existingImages, setExistingImages] = useState([]);
  // newImages holds only new File objects
  const [newImages, setNewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // Helper function to convert a base64 data URL to a File object.
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;
        if (!token) throw new Error("Invalid authentication token");

        const response = await fetch(
          `${endpoint}api/protected/car-listing/carlisting/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch listing data");

        const data = await response.json();
        setFormData({
          model: data.model ?? "",
          make: data.make ?? "",
          price: data.price?.toString() ?? "",
          year: data.year?.toString() ?? "",
          mileage: data.mileage?.toString() ?? "",
          exteriorColor: data.exteriorColor ?? "",
          interiorColor: data.interiorColor ?? "",
          transmission: data.transmission ?? "",
          fuelType: data.fuelType ?? "",
          vin: data.vin ?? "",
          vehicleType: data.vehicleType ?? "",
          noOfSeats: data.noOfSeats?.toString() ?? "",
          status: data.status ?? "",
        });
        // Set existing images from the server as base64 strings.
        setExistingImages(data.carImages.map((img) => img.base64));
      } catch (error) {
        setErrorMessage("Failed to fetch listing data: " + error.message);
      }
    };
    fetchData();
  }, [id, endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setNewImages((prev) => [...prev, ...filesArray]);
      setExistingImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
    // Determine if the removed image is from newImages.
    if (index >= existingImages.length - newImages.length) {
      const newIndex = index - (existingImages.length - newImages.length);
      const newFiles = [...newImages];
      newFiles.splice(newIndex, 1);
      setNewImages(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });
      if (!tokenResponse.ok)
        throw new Error("Failed to get authentication token");

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
      const formDataObj = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      // Calculate how many images came from the server.
      const serverImagesCount = existingImages.length - newImages.length;
      const serverImages = existingImages.slice(0, serverImagesCount);

      // Convert each server image (base64 string) to a File and append.
      serverImages.forEach((dataURL, index) => {
        const file = dataURLtoFile(dataURL, `server-image-${index}.png`);
        if (file) {
          formDataObj.append("images", file);
        }
      });

      // Append new images (already File objects).
      newImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      const response = await fetch(
        `${endpoint}api/protected/car-listing/update-car-listing/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataObj,
        }
      );

      if (!response.ok)
        throw new Error(`Failed to update listing: ${response.statusText}`);

      setSuccessMessage("Car listing updated successfully!");
      router.push(`/dashboard/car-dealer/car-listings/${id}`);
    } catch (error) {
      setErrorMessage("Error updating listing: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      {/* Back Button */}
      <Link href="/dashboard/car-dealer/car-listings">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <FiArrowLeft size={18} />
          Back to Listings
        </Button>
      </Link>
      <Card className="shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Car Listing</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map(
            (key) =>
              // Exclude fields not intended for editing
              !["id", "dealership", "createdAt", "carImages"].includes(key) && (
                <div key={key} className="mb-4">
                  <label className="block font-semibold mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              )
          )}

          <div className="mb-4">
            <label className="block font-semibold mb-2">Add Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded p-2"
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Car Image ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                    onClick={() => removeImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mt-3"
          >
            Update Listing
          </Button>
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-blue-500">{successMessage}</p>}
      </Card>
    </div>
  );
};

export default EditCarListing;

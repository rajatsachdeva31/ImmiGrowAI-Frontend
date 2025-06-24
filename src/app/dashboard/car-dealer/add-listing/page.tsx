"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const AddCarListing = () => {
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

  const [images, setImages] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // Handle input changes for text/number fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Basic validation for required fields and image count
  const validateForm = () => {
    // Check that every field is provided (adjust as needed)
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        setErrorMessage(`Field "${key}" is required.`);
        return false;
      }
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setErrorMessage("Please enter a valid price.");
      return false;
    }

    if (images.length === 0 || images.length > 3) {
      setErrorMessage("You must upload between 1 and 3 images.");
      return false;
    }

    setErrorMessage(""); // Clear any previous error
    return true;
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const formDataObj = new FormData();
      // Append every field from the formData state
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      // Append images
      images.forEach((image) => formDataObj.append("images", image));

      const response = await fetch(
        `${endpoint}api/protected/car-listing/add-car-listing`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      if (response.ok) {
        setSuccessMessage("Car listing created successfully!");
        setErrorMessage("");
        router.push("/dashboard/car-dealer/car-listings");
      } else {
        setErrorMessage("Failed to create car listing. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      {/* Back Button */}
      <Link href="/dashboard/car-dealer">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <FiArrowLeft size={18} />
          Back to Listings
        </Button>
      </Link>
      <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg mt-8">
        <h1 className="text-2xl font-bold mb-6">Add Car Listing</h1>
        <form onSubmit={handleSubmit}>
          {/* Model */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Make */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Mileage */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Exterior Color */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Exterior Color</label>
            <input
              type="text"
              name="exteriorColor"
              value={formData.exteriorColor}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Interior Color */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Interior Color</label>
            <input
              type="text"
              name="interiorColor"
              value={formData.interiorColor}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Transmission */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Transmission</label>
            <input
              type="text"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Fuel Type */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fuel Type</label>
            <input
              type="text"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* VIN */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Vehicle Type</label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Number of Seats */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Number of Seats</label>
            <input
              type="number"
              name="noOfSeats"
              value={formData.noOfSeats}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Upload Images (Max: 3)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded p-2"
            />
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-blue-500">{successMessage}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mt-3"
          >
            Submit Car Listing
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCarListing;

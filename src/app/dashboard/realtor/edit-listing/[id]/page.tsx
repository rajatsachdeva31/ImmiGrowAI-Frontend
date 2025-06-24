"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

// Helper function to convert a base64 data URL to a File object.
const dataURLtoFile = (dataurl: string, filename: string) => {
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

const EditHouseListing = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    openhouse: false,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  // existingImages holds base64 strings from the server and previews for new images.
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // newImages holds File objects from new uploads.
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // Fetch listing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token");
        }
        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;
        if (!token) throw new Error("Invalid authentication token");

        const response = await fetch(
          `${endpoint}api/protected/house-listing/houselisting/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listing data");
        }
        const data = await response.json();
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          location: data.location || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          squareFeet: data.squareFeet?.toString() || "",
          openhouse: data.openhouse || false,
          startDate: data.startdate ? data.startdate.split("T")[0] : "",
          endDate: data.endDate ? data.endDate.split("T")[0] : "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
        });
        // Assume the API returns houseImages as an array of { base64: string } objects.
        setExistingImages(data.houseImages.map((img: any) => img.base64));
      } catch (error: any) {
        setErrorMessage("Failed to fetch listing data: " + error.message);
      }
    };

    fetchData();
  }, [id, endpoint]);

  // Update form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle open house checkbox
  const handleToggleOpenHouse = () => {
    setFormData((prev) => ({ ...prev, openhouse: !prev.openhouse }));
  };

  // Handle new file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setNewImages((prev) => [...prev, ...filesArray]);
      setExistingImages((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove an image from the preview and newImages if applicable.
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    if (index >= existingImages.length - newImages.length) {
      const newIndex = index - (existingImages.length - newImages.length);
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.price || !formData.location) {
      setErrorMessage("Title, price, and location are required.");
      return false;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setErrorMessage("Please enter a valid price.");
      return false;
    }
    if (formData.openhouse) {
      if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
        setErrorMessage("Start and end date, and time are required for open house.");
        return false;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setErrorMessage("Start date must be earlier than end date.");
        return false;
      }
    }
    if (newImages.length > 3) {
      setErrorMessage("You can upload a maximum of 3 new images.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, { credentials: "include" });
      if (!tokenResponse.ok) throw new Error("Failed to get authentication token");
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      // Convert numeric fields to numbers.
      const numericFields = {
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        // Backend expects key "sqft" for square footage.
        sqft: Number(formData.squareFeet),
      };

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("location", formData.location);
      formDataObj.append("openhouse", JSON.stringify(formData.openhouse));
      if (formData.openhouse) {
        formDataObj.append("startDate", formData.startDate);
        formDataObj.append("endDate", formData.endDate);
        formDataObj.append("startTime", formData.startTime);
        formDataObj.append("endTime", formData.endTime);
      }
      // Append numeric fields with correct keys.
      formDataObj.append("price", numericFields.price.toString());
      formDataObj.append("bedrooms", numericFields.bedrooms.toString());
      formDataObj.append("bathrooms", numericFields.bathrooms.toString());
      formDataObj.append("sqft", numericFields.sqft.toString());

      // Append existing images from the server.
      const serverImagesCount = existingImages.length - newImages.length;
      const serverImages = existingImages.slice(0, serverImagesCount);
      serverImages.forEach((dataURL, index) => {
        const file = dataURLtoFile(dataURL, `server-image-${index}.png`);
        if (file) formDataObj.append("images", file);
      });

      // Append newly selected images.
      newImages.forEach((image) => {
        formDataObj.append("images", image);
      });

      const response = await fetch(
        `${endpoint}api/protected/house-listing/update-house-listing/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataObj,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update listing: ${response.statusText}`);
      }
      setSuccessMessage("House listing updated successfully!");
      router.push(`/dashboard/realtor/house-listings/${id}`);
    } catch (error: any) {
      console.error("Error updating listing:", error);
      setErrorMessage("Error updating listing: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      {/* Back Button */}
      <Link href="/dashboard/realtor/house-listings">
        <Button variant="ghost" className="flex items-center gap-2 mb-4">
          <FiArrowLeft size={18} />
          Back to Listings
        </Button>
      </Link>
      <Card className="shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Edit House Listing</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Title"
                required
              />
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Price"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Location"
                required
              />
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Bedrooms"
              />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Bathrooms"
              />
              <input
                type="number"
                name="squareFeet"
                value={formData.squareFeet}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Square Feet"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-4"
              placeholder="Description"
            ></textarea>

            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.openhouse}
                  onChange={handleToggleOpenHouse}
                />
                <span>Open House</span>
              </label>
            </div>

            {formData.openhouse && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="End Date"
                />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Start Time"
                />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="End Time"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="block font-semibold mb-2">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`House Image ${index}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                      onClick={() => removeExistingImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mt-4"
            >
              Update Listing
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditHouseListing;

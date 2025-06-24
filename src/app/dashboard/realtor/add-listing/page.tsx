"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const AddListing = () => {
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

    const [images, setImages] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const endpoint = process.env.NEXT_PUBLIC_API_URL;

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Toggle open house checkbox
    const handleToggleOpenHouse = () => {
        setFormData((prev) => ({ ...prev, openhouse: !prev.openhouse }));
    };

    // Handle image uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    // Validation function
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

        if (images.length === 0 || images.length > 3) {
            setErrorMessage("You must upload between 1 and 3 images.");
            return false;
        }

        setErrorMessage(""); // Clear any previous error message
        return true;
    };

    // Submit form
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
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            images.forEach((image) => formDataObj.append("images", image));

            const response = await fetch(`${endpoint}api/protected/house-listing/add-house-listing`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataObj,
            });

            if (response.ok) {
                setSuccessMessage("Listing created successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage("Failed to create listing. Please try again.");
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-2">
        {/* Back Button */}
        <Link href="/dashboard/realtor/house-listings">
          <Button variant="ghost" className="flex items-center gap-2 mb-4">
            <FiArrowLeft size={18} />
            Back to Listings
          </Button>
        </Link>
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-2xl font-bold mb-6">Add House Listing</h1>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded p-2 mb-4"
                    placeholder="Title"
                    required
                />

                {/* Description */}
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-2 mb-4"
                    placeholder="Description"
                />

                {/* Price & Location */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Price"
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Location"
                        required
                    />
                </div>

                {/* Bedrooms, Bathrooms, Square Feet */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Bedrooms"
                    />
                    <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Bathrooms"
                    />
                    <input
                        type="number"
                        name="squareFeet"
                        value={formData.squareFeet}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Square Feet"
                    />
                </div>

                {/* Open House Checkbox */}
                <label className="flex items-center space-x-2 mb-4">
                    <input
                        type="checkbox"
                        checked={formData.openhouse}
                        onChange={handleToggleOpenHouse}
                    />
                    <span>Open House</span>
                </label>

                {/* Open House Details */}
                {formData.openhouse && (
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                )}

                {/* Image Upload */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border rounded p-2 mb-4"
                />

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                {/* Submit Button */}
                <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
                    Submit Listing
                </Button>
            </form>
        </div>
        </div>
    );
};

export default AddListing;

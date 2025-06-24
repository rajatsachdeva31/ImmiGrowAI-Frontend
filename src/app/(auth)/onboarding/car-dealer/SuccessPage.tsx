import React from "react";
import { FormData } from "./types"; // Importing FormData interface

const SuccessPage: React.FC<{ formData: FormData }> = ({ formData }) => {
  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2">Review Details</h2>
      <p className="text-center mb-4">
        Please review the details you have provided below.
      </p>
      <span className="flex justify-between mb-1">
        <strong>Full Name:</strong> {formData.fullName}
      </span>
      {/* <span className="flex justify-between mb-1">
        <strong>Email:</strong> {formData.email}
      </span> */}
      <span className="flex justify-between mb-1">
        <strong>Phone Number:</strong> {formData.phoneNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Showroom Location(s):</strong> {formData.showroomLocations}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Test Drive Policy:</strong> {formData.testDrivePolicy}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Trade-in Options:</strong>{" "}
        {formData.tradeInOptions ? "Yes" : "No"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Registration Number:</strong>{" "}
        {formData.businessRegistrationNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Name:</strong> {formData.businessName}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Address:</strong> {formData.businessAddress}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Years in Business:</strong> {formData.yearsInBusiness}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Dealership License Number:</strong>{" "}
        {formData.dealershipLicenseNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Car Brands Sold:</strong> {formData.carBrandsSold.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>New or Used Cars:</strong>{" "}
        {formData.newOrUsedCars.new ? "New" : ""}{" "}
        {formData.newOrUsedCars.used ? "Used" : ""}{" "}
        {formData.newOrUsedCars.both ? "Both" : ""}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Government ID:</strong>{" "}
        {formData.governmentId ? "Provided" : "Not provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>License Document:</strong>{" "}
        {formData.licenseDocument ? "Provided" : "Not provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Verification:</strong>{" "}
        {formData.businessVerification ? "Provided" : "Not provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Background Check Approved:</strong>{" "}
        {formData.backgroundCheckApproved? "Yes" : "No"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Terms Accepted:</strong> {formData.termsAccepted ? "Yes" : "No"}
      </span>
    </div>
  );
};

export default SuccessPage;

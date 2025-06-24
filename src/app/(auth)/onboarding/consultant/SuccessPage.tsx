import React from "react";
import { FormData } from "./types";

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
      <span className="flex justify-between mb-1">
        <strong>Email:</strong> {formData.email}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Phone Number:</strong> {formData.phoneNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Date of Birth:</strong> {formData.dateOfBirth}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Countries Served:</strong> {formData.countriesServed.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Consultation Fee:</strong> {formData.consultationFee}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Registration Number:</strong>{" "}
        {formData.businessRegistrationNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Partnered Legal Firms:</strong> {formData.partneredLegalFirms}
      </span>
    
      <span className="flex justify-between mb-1">
        <strong>Website Links:</strong> {formData.websiteLinks}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Name:</strong> {formData.businessName}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Address:</strong> {formData.businessAddress}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Years of Experience:</strong> {formData.yearsOfExperience}
      </span>
      <span className="flex justify-between mb-1">
        <strong>License Number:</strong> {formData.licenseNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Immigration Services:</strong>{" "}
        {formData.immigrationServices.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Languages Spoken:</strong> {formData.languagesSpoken.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Government ID:</strong>{" "}
        {formData.governmentId ? "Provided" : "Not Provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Verification:</strong>{" "}
        {formData.businessVerification ? "Provided" : "Not Provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>License Document:</strong>{" "}
        {formData.licenseDocument ? "Provided" : "Not Provided"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Background Check Approved:</strong>{" "}
        {formData.backgroundCheckApproved ? "Yes" : "No"}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Terms Accepted:</strong> {formData.termsAccepted ? "Yes" : "No"}
      </span>
    </div>
  );
};

export default SuccessPage;

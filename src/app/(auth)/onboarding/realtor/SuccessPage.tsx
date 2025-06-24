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
        <strong>Phone Number:</strong> {formData.phoneNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Date of Birth:</strong> {formData.dateOfBirth}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Name:</strong> {formData.businessName}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Business Address:</strong> {formData.businessAddress}
      </span>
      <span className="flex justify-between mb-1">
        <strong>License Number:</strong> {formData.licenseNumber}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Years of Experience:</strong> {formData.yearsOfExperience}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Affiliated Associations:</strong>{" "}
        {formData.affiliatedAssociations}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Areas Covered:</strong> {formData.areasCovered.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Specialties:</strong> {formData.specialties.join(", ")}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Portfolio Link:</strong> {formData.portfolioLink}
      </span>
      <span className="flex justify-between mb-1">
        <strong>Registration Number:</strong> {formData.registrationNumber}
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

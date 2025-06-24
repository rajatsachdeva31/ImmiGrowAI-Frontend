"use client";

import React, { useState } from "react";
import BusinessInformation from "./BusinessInformation";
import OfficeWorkSetup from "./OfficeWorkSetup";
import SuccessPage from "./SuccessPage";
import type { FormData } from "./types";
import { Button } from "@/components/ui/button";
import PersonalInformation from "@/components/onboarding/PersonalInformation";
import TermsAndConditions from "@/components/onboarding/TermsAndConditions";
import DocumentUpload from "@/components/onboarding/DocumentUpload";
import { useRouter } from "next/navigation";

const Realtor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_API_URL;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    businessName: "",
    businessAddress: "",
    licenseNumber: "",
    yearsOfExperience: "",
    affiliatedAssociations: "",
    areasCovered: [],
    specialties: [],
    portfolioLink: "",
    registrationNumber: "",
    workType: "",
    brokerageName: "",
    officeLocationAvailability: "",
    numberOfTeamMembers: 0,
    virtualTourAvailability: "",
    governmentId: "",
    businessVerification: "",
    licenseDocument: "",
    backgroundCheckApproved: false,
    termsAccepted: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      // Full Name Validation
      if (!formData.fullName || formData.fullName.length < 3) {
        newErrors.fullName = "Full Name must be at least 3 characters";
      }

      // Phone Number Validations
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d+$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must contain only digits";
      } else if (formData.phoneNumber.length !== 10) {
        newErrors.phoneLength = "Phone number must be exactly 10 digits";
      }

      // Date of Birth Validation (Minimum 15 years old)
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required";
      } else {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 15); // 15 years ago

        if (dob > minDate) {
          newErrors.dateOfBirth = "You must be at least 15 years old";
        }
      }
    } else if (currentStep === 2) {
      // Business Name Validation
      if (!formData.businessName || formData.businessName.trim() === "") {
        newErrors.businessName = "Business name is required.";
      }

      // Business Address Validation
      if (!formData.businessAddress || formData.businessAddress.trim() === "") {
        newErrors.businessAddress = "Business address is required.";
      }

      // License Number Validation
      if (!formData.licenseNumber || formData.licenseNumber.trim() === "") {
        newErrors.licenseNumber = "License number is required.";
      }

      // Years of Experience Validation
      if (!formData.yearsOfExperience) {
        newErrors.yearsOfExperience = "Years of experience is required.";
      }

      // Affiliated Associations Validation
      if (
        !formData.affiliatedAssociations ||
        formData.affiliatedAssociations.trim() === ""
      ) {
        newErrors.affiliatedAssociations =
          "Affiliated associations are required.";
      }

      // Areas Covered Validation (at least one required)
      if (!formData.areasCovered || formData.areasCovered.length === 0) {
        newErrors.areasCovered = "At least one area must be selected.";
      }

      // Specialties Validation (at least one required)
      if (!formData.specialties || formData.specialties.length === 0) {
        newErrors.specialties = "At least one specialty must be selected.";
      }

      if (!formData.portfolioLink) {
        newErrors.portfolioLinkRequired = "Link is required";
      } else if (
        !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.portfolioLink)
      ) {
        newErrors.portfolioLink = "Invalid website link.";
      }

      // Registration Number Validation
      if (
        !formData.registrationNumber ||
        formData.registrationNumber.trim() === ""
      ) {
        newErrors.registrationNumber = "Registration number is required.";
      }
    } else if (currentStep === 3) {
      if (!formData.workType) {
        newErrors.workType = "Work type is required.";
      }

      if (formData.workType === "brokerage" && !formData.brokerageName) {
        newErrors.brokerageName = "Brokerage name is required.";
      }

      if (!formData.officeLocationAvailability) {
        newErrors.officeLocationAvailability =
          "Please select office location availability.";
      }

      if (!formData.virtualTourAvailability) {
        newErrors.virtualTourAvailability =
          "Please select virtual tour availability.";
      }
    } else if (currentStep === 4) {
      if (!formData.governmentId) {
        newErrors.governmentId = "Government ID is required.";
      }
      if (!formData.businessVerification) {
        newErrors.businessVerification =
          "Business verification document is required.";
      }
      if (!formData.licenseDocument) {
        newErrors.licenseDocument = "License document is required.";
      }
    } else if (currentStep === 5) {
      if (formData.backgroundCheckApproved === false) {
        newErrors.backgroundCheckApproved =
          "Please accept the background verification.";
      }
      if (formData.termsAccepted === false) {
        newErrors.termsAccepted = "Please accept the terms and conditions.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phoneNo", formData.phoneNumber);
      formDataToSend.append("DOB", formData.dateOfBirth);
      formDataToSend.append("rolename", "Realtor");
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("businessAddress", formData.businessAddress);
      formDataToSend.append("realEstateLicenseNumber", formData.licenseNumber);
      formDataToSend.append("experienceYears", formData.yearsOfExperience);
      formDataToSend.append(
        "affiliatedAssociations",
        formData.affiliatedAssociations
      );
      formDataToSend.append("areasCovered", formData.areasCovered.join(","));
      formDataToSend.append("specialties", formData.specialties.join(","));
      formDataToSend.append("portfolioLink", formData.portfolioLink);
      formDataToSend.append("registrationNumber", formData.registrationNumber);
      formDataToSend.append("workType", formData.workType);
      formDataToSend.append("brokerageName", formData.brokerageName);
      formDataToSend.append(
        "officeLocationAvailable",
        String(formData.officeLocationAvailability === "yes")
      );
      formDataToSend.append(
        "teamMembers",
        String(formData.numberOfTeamMembers ?? "")
      );
      formDataToSend.append(
        "virtualPropertyTour",
        String(formData.virtualTourAvailability === "yes")
      );

      formDataToSend.append("govId", formData.governmentId);
      formDataToSend.append("businessDoc", formData.businessVerification);
      formDataToSend.append("licenseCert", formData.licenseDocument);
      formDataToSend.append(
        "backgroundVerification",
        formData.backgroundCheckApproved.toString()
      );
      formDataToSend.append(
        "termsConditionCheck",
        formData.termsAccepted.toString()
      );

      const response = await fetch(`${endpoint}api/onboarding/information`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard/not-verified?reason=user");
      } else {
        console.error(
          "Failed to create user and upload documents:",
          data.error
        );
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="max-w-md lg:max-w-xl w-full min-h-[600px] h-full">
        <div className="py-8 px-6 shadow text-center w-full h-full flex flex-col justify-between">
          {currentStep === 1 && (
            <PersonalInformation
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <BusinessInformation
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <OfficeWorkSetup
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <DocumentUpload
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {currentStep === 5 && (
            <TermsAndConditions
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {currentStep === 6 && <SuccessPage formData={formData} />}
          <div className="flex gap-4 justify-center">
            {currentStep > 1 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
            {currentStep == 1 && (
              <Button onClick={() => router.push("/onboarding")}>Back</Button>
            )}
            {currentStep < 6 && <Button onClick={handleNextStep}>Next</Button>}
            {currentStep === 6 && (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Realtor;

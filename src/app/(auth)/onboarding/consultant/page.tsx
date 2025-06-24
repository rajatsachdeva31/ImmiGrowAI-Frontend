"use client";

import { Button } from "@/components/ui/button"; // Corrected import statement
import React, { useState } from "react";
import type { FormData } from "./types";
import BusinessInformation from "./BusinessInformation";
import SuccessPage from "./SuccessPage";
import PersonalInformation from "@/components/onboarding/PersonalInformation";
import TermsAndConditions from "@/components/onboarding/TermsAndConditions";
import DocumentUpload from "@/components/onboarding/DocumentUpload";
import { useRouter } from "next/navigation";

const Consultant = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    countriesServed: [],
    consultationFee: 0,
    businessRegistrationNumber: "",
    partneredLegalFirms: "",
    websiteLinks: "",
    businessName: "",
    businessAddress: "",
    yearsOfExperience: "",
    licenseNumber: "",
    immigrationServices: [],
    languagesSpoken: [],
    governmentId: "",
    businessVerification: "",
    licenseDocument: "",
    backgroundCheckApproved: false,
    termsAccepted: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [errors, setErrors] = useState({});

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
      // Validate Business Name
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required.";
      }

      // Validate Business Address
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = "Business address is required.";
      }

      // Validate Registration Number
      if (!formData.businessRegistrationNumber.trim()) {
        newErrors.businessRegistrationNumber =
          "Registration number is required.";
      }

      // Validate Years of Experience (must be a number)
      if (!formData.yearsOfExperience.trim()) {
        newErrors.yearsOfExperience = "Years of experience is required.";
      }

      // Validate License Number
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required.";
      }

      // Validate Countries Served (must have at least one selection)
      if (!formData.countriesServed || formData.countriesServed.length === 0) {
        newErrors.countriesServed = "Please select at least one country.";
      }

      // Validate Consultation Fee (must be a valid number)
      if (!formData.consultationFee) {
        newErrors.consultationFee = "Consultation fee is required.";
      } else if (
        isNaN(Number(formData.consultationFee)) ||
        Number(formData.consultationFee) < 0
      ) {
        newErrors.consultationFee = "Please enter a valid fee.";
      }

      // Validate Partnered Legal Firms
      if (!formData.partneredLegalFirms.trim()) {
        newErrors.partneredLegalFirms = "Please enter partnered legal firms.";
      }

      // Validate Website Links (should be a valid URL)
      if (
        !formData.websiteLinks ||
        (formData.websiteLinks.trim() &&
          !/^https?:\/\/[^\s]+$/.test(formData.websiteLinks))
      ) {
        newErrors.websiteLinks = "Please enter a valid website URL.";
      }

      // Validate Immigration Services (must have at least one selection)
      if (
        !formData.immigrationServices ||
        formData.immigrationServices.length === 0
      ) {
        newErrors.immigrationServices = "Please select at least one service.";
      }

      // Validate Languages Spoken (must have at least one selection)
      if (!formData.languagesSpoken || formData.languagesSpoken.length === 0) {
        newErrors.languagesSpoken = "Please select at least one language.";
      }
    } else if (currentStep === 3) {
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
    } else if (currentStep === 4) {
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

  const [isLoading, setIsLoading] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phoneNo", formData.phoneNumber);
      formDataToSend.append("DOB", formData.dateOfBirth);
      formDataToSend.append("rolename", "Immigration Consultant");
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("businessAddress", formData.businessAddress);
      formDataToSend.append(
        "businessRegistration",
        formData.businessRegistrationNumber
      );
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append("licenseNumber", formData.licenseNumber);
      formDataToSend.append(
        "countriesServed",
        formData.countriesServed.join(",")
      );
      formDataToSend.append(
        "consultationFee",
        String(formData.consultationFee)
      );
      formDataToSend.append(
        "partneredLegalFirms",
        formData.partneredLegalFirms
      );
      formDataToSend.append("websiteLinks", formData.websiteLinks);
      formDataToSend.append(
        "servicesOffered",
        formData.immigrationServices.join(",")
      );
      formDataToSend.append(
        "languagesSpoken",
        formData.languagesSpoken.join(",")
      );
      formDataToSend.append("govId", formData.governmentId);
      formDataToSend.append("licenseCert", formData.licenseDocument);
      formDataToSend.append("businessDoc", formData.businessVerification);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      router.push("/dashboard/not-verified?reason=user");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="max-w-md lg:max-w-xl w-full min-h-[600px] h-full">
        <div className="py-8 px-6 shadow text-center w-full h-full flex flex-col justify-between">
          {currentStep === 1 && (
            <div>
              <PersonalInformation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <BusinessInformation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <DocumentUpload
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <TermsAndConditions
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          )}
          {currentStep === 5 && <SuccessPage formData={formData} />}
          <div className="flex gap-4 justify-center">
            {currentStep == 1 && (
              <Button onClick={() => router.push("/onboarding")}>Back</Button>
            )}
            {currentStep > 1 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
            {currentStep < 5 && <Button onClick={handleNextStep}>Next</Button>}
            {currentStep === 5 && (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultant;

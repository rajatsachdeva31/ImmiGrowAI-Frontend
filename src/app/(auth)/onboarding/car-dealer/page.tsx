"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import BusinessInformation from "./BusinessInformation";
// import DocumentUpload from "./DocumentUpload";
import type { FormData } from "./types";
import PersonalInformation from "@/components/onboarding/PersonalInformation";
import TermsAndConditions from "@/components/onboarding/TermsAndConditions";
import DocumentUpload from "@/components/onboarding/DocumentUpload";
import SuccessPage from "./SuccessPage";
import { useRouter } from "next/navigation";

const CarDealer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    showroomLocations: "",
    testDrivePolicy: "",
    vehicleFinancingOptions: {
      inHouseFinancing: false,
      thirdPartyBanks: false,
      leaseOptions: false,
    },
    tradeInOptions: false,
    serviceWarrantyInfo: "",
    businessRegistrationNumber: "",
    businessName: "",
    businessAddress: "",
    yearsInBusiness: "",
    dealershipLicenseNumber: "",
    carBrandsSold: [],
    newOrUsedCars: {
      new: false,
      used: false,
      both: false,
    },
    governmentId: "",
    licenseDocument: "",
    businessVerification: "",
    backgroundCheckApproved: false,
    termsAccepted: false,
  });

    const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if(currentStep===1){
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
    }

    else if(currentStep === 2){

        // Business Name Validation
    // Validate Showroom Location
    if (!formData.showroomLocations) {
      newErrors.showroomLocations = "Showroom Location(s) are required.";
    }
  
    // Validate Test Drive Policy
    if (!formData.testDrivePolicy) {
      newErrors.testDrivePolicy = "Test Drive Policy is required.";
    }
  
    // Validate Vehicle Financing Options (Check at least one option is selected)
    const { inHouseFinancing, thirdPartyBanks, leaseOptions } = formData.vehicleFinancingOptions;
    if (!inHouseFinancing && !thirdPartyBanks && !leaseOptions) {
      newErrors.vehicleFinancingOptions = "At least one vehicle financing option must be selected.";
    }
  
    // Validate Service & Warranty Information
    if (!formData.serviceWarrantyInfo) {
      newErrors.serviceWarrantyInfo = "Service & Warranty Information is required.";
    }
  
    // Validate Business Registration Number
    if (!formData.businessRegistrationNumber) {
      newErrors.businessRegistrationNumber = "Business Registration Number is required.";
    }
  
    // Validate Business Name
    if (!formData.businessName) {
      newErrors.businessName = "Business Name is required.";
    }
  
    // Validate Business Address
    if (!formData.businessAddress) {
      newErrors.businessAddress = "Business Address is required.";
    }
  
    // Validate Years in Business
    if (!formData.yearsInBusiness) {
      newErrors.yearsInBusiness = "Please select years in business.";
    }
  
    // Validate Dealership License Number
    if (!formData.dealershipLicenseNumber) {
      newErrors.dealershipLicenseNumber = "Dealership License Number is required.";
    }
  
    // Validate Car Brands Sold (At least one brand must be selected)
    if (formData.carBrandsSold.length === 0) {
      newErrors.carBrandsSold = "At least one car brand must be selected.";
    }
  
    // Validate New or Used Cars checkboxes (At least one should be checked)
    // const { new: isNew, used: isUsed, both: isBoth } = formData.newOrUsedCars;
    // if (!isNew && !isUsed && !isBoth) {
    //   newErrors.newOrUsedCars = "Please select at least one option (New, Used, or Both).";
    // }
  }


  else if(currentStep===3){
    if (!formData.governmentId) {
      newErrors.governmentId = "Government ID is required.";
    }
    if (!formData.businessVerification) {
      newErrors.businessVerification = "Business verification document is required.";
    }
    if (!formData.licenseDocument) {
      newErrors.licenseDocument = "License document is required.";
    
  }
}
  else if(currentStep===4){
    
    if (formData.backgroundCheckApproved === false) {
      newErrors.backgroundCheckApproved = "Please accept the background verification.";
    }
    if (formData.termsAccepted === false) {
      newErrors.termsAccepted = "Please accept the terms and conditions.";
    }

  }
 

      setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNextStep = () => {
    // Validate required fields
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
      formDataToSend.append("rolename", "Car Dealership");
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("businessAddress", formData.businessAddress);
      formDataToSend.append("businessRegistration", formData.businessRegistrationNumber);
      formDataToSend.append("yearsInBusiness", formData.yearsInBusiness);
      formDataToSend.append("dealershipLicenseNumber", formData.dealershipLicenseNumber);
      formDataToSend.append("carBrandsSold", formData.carBrandsSold.join(","));
      formDataToSend.append("newOrUsedCars", JSON.stringify(formData.newOrUsedCars));
      formDataToSend.append("showroomLocations", formData.showroomLocations);
      formDataToSend.append("testDrivePolicy", formData.testDrivePolicy);
      formDataToSend.append("financingOptions", JSON.stringify(formData.vehicleFinancingOptions));
      formDataToSend.append("tradeInOptions", formData.tradeInOptions.toString());
      formDataToSend.append("serviceWarrantyInfo", formData.serviceWarrantyInfo);
      formDataToSend.append("govId", formData.governmentId);
      formDataToSend.append("licenseCert", formData.licenseDocument);
      formDataToSend.append("businessDoc", formData.businessVerification);
      formDataToSend.append("backgroundVerification", formData.backgroundCheckApproved.toString());
      formDataToSend.append("termsConditionCheck", formData.termsAccepted.toString());

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
            <DocumentUpload formData={formData} setFormData={setFormData}  errors={errors} />
          )}
          {currentStep === 4 && (
            <TermsAndConditions formData={formData} setFormData={setFormData}  errors={errors} />
          )}
          {currentStep === 5 && <SuccessPage formData={formData} />}
          <div className="flex gap-4 justify-center">
            {currentStep > 1 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
            {currentStep == 1 && (
              <Button onClick={() => router.push("/onboarding")}>Back</Button>
            )}
            {currentStep < 5 && <Button onClick={handleNextStep}>Next</Button>}
            {currentStep === 5 && (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDealer;

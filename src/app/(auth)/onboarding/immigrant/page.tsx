"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import TermsAndConditions from "@/components/onboarding/TermsAndConditions";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  alreadyInCanada: boolean;
  countryOfOrigin: string;
  workSchoolLocation: string;
  statusInCanada: string;
  governmentId: File | null;
  backgroundCheckApproved: boolean;
  termsAccepted: boolean;
}

const Immigrant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    alreadyInCanada: false,
    countryOfOrigin: "",
    workSchoolLocation: "",
    statusInCanada: "",
    governmentId: null,
    backgroundCheckApproved: false,
    termsAccepted: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // const [token, setToken] = useState("");
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, governmentId: e.target.files[0] });
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return false;
    }
    
    if (!formData.statusInCanada && formData.alreadyInCanada) {
      setError("Status in Canada is required");
      return false;
    }
    if (!formData.countryOfOrigin) {
      setError("Country of Origin is required");
      return false;
    }
    if (!formData.workSchoolLocation && formData.alreadyInCanada) {
      setError("Location is required");
      return false;
    }
    if (!formData.governmentId) {
      setError("Government ID is required");
      return false;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return false;
    }
    if (!formData.backgroundCheckApproved) {
      setError("You must approve background check");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

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
      formDataToSend.append("DOB", formData.dateOfBirth);
      formDataToSend.append("phoneNo", formData.phoneNumber);
      formDataToSend.append("alreadyInCanada", formData.alreadyInCanada ? "true" : "false");
      formDataToSend.append("workSchoolLocation", formData.workSchoolLocation);
      formDataToSend.append("countryOfOrigin", formData.countryOfOrigin);
      formDataToSend.append("statusInCanada", formData.statusInCanada);
      formDataToSend.append("rolename", "Immigrant");
      formDataToSend.append(
        "backgroundVerification",
        String(formData.backgroundCheckApproved)
      );

      formDataToSend.append(
        "termsConditionCheck",
        String(formData.termsAccepted)
      );
      if (formData.governmentId) {
        formDataToSend.append("govId", formData.governmentId);
      }

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

      setSuccess(true);
      router.push("/dashboard/not-verified?reason=user");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="max-w-md lg:max-w-xl w-full min-h-[600px] h-full">
        <div className="py-8 px-6 shadow text-center w-full h-full flex flex-col justify-between">
          {currentStep === 1 && (
            <div className="text-left">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="flex justify-between items-center">
                <Label>Full Name:</Label>
                <Input
                  className="w-2/3 mb-4"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <Label>Phone Number:</Label>
                <Input
                  className="w-2/3 mb-4"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <Label>Date of Birth:</Label>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-2/3 mb-4",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      {formData.dateOfBirth ? (
                        format(new Date(formData.dateOfBirth), "PPP")
                      ) : (
                        <span>Date of Birth</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                          : undefined
                      }
                      onSelect={(date) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        })
                      }
                      onDayClick={() => setIsOpen(false)}
                      fromYear={1960}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-between items-center">
                <Label>Country Of Origin:</Label>
                <Input
                  className="w-2/3 mb-4"
                  type="text"
                  value={formData.countryOfOrigin}
                  onChange={(e) =>
                    setFormData({ ...formData, countryOfOrigin: e.target.value })
                  }
                />
                </div>

                <div className="flex mt-2 items-center mb-4">
                  <Label htmlFor="alreadyInCanada">Already In Canada:</Label>
                  <Checkbox
                    id="alreadyInCanada"
                    className="ml-14"
                    checked={formData.alreadyInCanada}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, alreadyInCanada: !!checked })
                    }
                  />
                </div>

              {formData.alreadyInCanada === true && (
              <div className="flex justify-between items-center">
                <Label>Status in Canada:</Label>
                <Select
                  value={formData.statusInCanada}
                  onValueChange={(value) =>
                    setFormData({ ...formData, statusInCanada: value })
                  }
                >
                  <SelectTrigger className="w-2/3 mb-4">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study Permit">Study Permit</SelectItem>
                    <SelectItem value="Work Permit">Work Permit</SelectItem>
                    <SelectItem value="Permanent Resident">
                      Permanent Resident
                    </SelectItem>
                    <SelectItem value="Citizen">Citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              )}
              {formData.alreadyInCanada === true && (
              <div className="flex justify-between items-center">
                <Label>School/Work Location:</Label>
                <Input
                  className="w-2/3 mb-4"
                  type="text"
                  value={formData.workSchoolLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, workSchoolLocation: e.target.value })
                  }
                />
                </div>
                )}
                
              <div className="flex justify-between items-center">
                <Label>Government ID:</Label>
                <Input
                  className="w-2/3 mb-4"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <TermsAndConditions
              formData={formData}
              setFormData={setFormData}
              errors={{}}
            />
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Review Details</h2>
              <p className="mb-4">
                Please review the details you have provided below.
              </p>
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-2 bg-green-100 text-green-600 rounded">
                  Form submitted successfully!
                </div>
              )}
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
                <strong>Country Of Origin:</strong> {formData.countryOfOrigin}
              </span>
              <span className="flex justify-between mb-1">
                <strong>Already In Canada</strong> {formData.alreadyInCanada ? "Yes" : "No"}
              </span>
              {formData.alreadyInCanada && ( <span className="flex justify-between mb-1">
                <strong>Status in Canada:</strong> {formData.statusInCanada}
              </span>)}
              {formData.alreadyInCanada && ( <span className="flex justify-between mb-1">
                <strong>School/Work Location:</strong> {formData.workSchoolLocation}
              </span>)}
              <span className="flex justify-between mb-1">
                <strong>Status in Canada:</strong> {formData.statusInCanada}
              </span>
              <span className="flex justify-between mb-1">
                <strong>Government ID:</strong>{" "}
                {formData.governmentId ? "Provided" : "Not Provided"}
              </span>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {currentStep > 1 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
            {currentStep == 1 && (
              <Button onClick={() => router.push("/onboarding")}>Back</Button>
            )}
            {currentStep < 3 && <Button onClick={handleNextStep}>Next</Button>}
            {currentStep === 3 && (
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

export default Immigrant;

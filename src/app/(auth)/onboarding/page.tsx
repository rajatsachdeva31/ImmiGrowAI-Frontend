"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Onboarding = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");

  const handleUserTypeChange = (value: string) => {
    setUserType(value);
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");

    if (!userType) {
      setError("Please select a user type.");
      setLoading(false);
      return;
    }

    const routeMap: { [key: string]: string } = {
      Realtors: "/onboarding/realtor",
      "Car Dealers": "/onboarding/car-dealer",
      "Immigration Consultants": "/onboarding/consultant",
      Immigrant: "/onboarding/immigrant",
    };

    // Redirect based on user type
    router.push(routeMap[userType]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="max-w-md lg:max-w-xl">
        <div className="py-8 px-6 shadow rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Onboarding Form</h2>
          <div className="flex gap-2"></div>
          <Select onValueChange={handleUserTypeChange}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Realtors">Realtors</SelectItem>
              <SelectItem value="Car Dealers">Car Dealers</SelectItem>
              <SelectItem value="Immigration Consultants">
                Immigration Consultants
              </SelectItem>
              <SelectItem value="Immigrant">Immigrant</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className={
              "bg-green-600 hover:bg-green-500 w-full mb-4" +
              (loading ? " cursor-not-allowed bg-green-300" : "")
            }
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Next"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

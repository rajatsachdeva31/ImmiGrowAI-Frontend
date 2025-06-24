import React from "react";
import { FormData } from "./types"; // Importing FormData interface
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as SingleSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select, { MultiValue } from "react-select";

type OptionType = { value: string; label: string };

const carBrandsOptions: OptionType[] = [
  { value: "Brand A", label: "Brand A" },
  { value: "Brand B", label: "Brand B" },
  { value: "Brand C", label: "Brand C" },
  // Add more brands as needed
];

const BusinessInformation: React.FC<{
  formData: FormData; // Use the correct type
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string }; // Use the correct type
}> = ({ formData, setFormData, errors }) => {
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Business Information</h2>
      <div className="flex justify-between items-center gap-1">
        <Label className="w-1/3">Showroom Location(s):</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.showroomLocations}
          onChange={(e) =>
            setFormData({ ...formData, showroomLocations: e.target.value })
          }
        />
      </div>
      {errors.showroomLocations && <p className="text-red-500 text-sm mb-4">{errors.showroomLocations}</p>}
      <div className="flex justify-between items-center">
        <Label>Test Drive Policy:</Label>
        <Textarea
          className="w-2/3 mb-4"
          value={formData.testDrivePolicy}
          onChange={(e) =>
            setFormData({ ...formData, testDrivePolicy: e.target.value })
          }
        />
      </div>
      {errors.testDrivePolicy && <p className="text-red-500 text-sm mb-4">{errors.testDrivePolicy}</p>}
      <div className="text-left mb-4">
        <p className="mb-2">Vehicle Financing Options:</p>
        <div className="flex justify-between items-center gap-1">
          <div className="flex gap-2">
            <Checkbox
              checked={formData.vehicleFinancingOptions.inHouseFinancing}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  vehicleFinancingOptions: {
                    ...formData.vehicleFinancingOptions,
                    inHouseFinancing: checked ? true : false,
                  },
                })
              }
            />
            <Label>In-house Financing</Label>
          </div>
          
          <div className="flex gap-2">
            <Checkbox
              checked={formData.vehicleFinancingOptions.thirdPartyBanks}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  vehicleFinancingOptions: {
                    ...formData.vehicleFinancingOptions,
                    thirdPartyBanks: checked ? true : false,
                  },
                })
              }
            />
            <Label>Third-Party Banks</Label>
          </div>

          <div className="flex gap-2">
            <Checkbox
              checked={formData.vehicleFinancingOptions.leaseOptions}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  vehicleFinancingOptions: {
                    ...formData.vehicleFinancingOptions,
                    leaseOptions: checked ? true : false,
                  },
                })
              }
            />
            <Label>Lease</Label>
          </div>
          
        </div>
      </div>
      {errors.vehicleFinancingOptions && <p className="text-red-500 text-sm mb-4">{errors.vehicleFinancingOptions}</p>}
      <div className="flex justify-between items-center">
        <Label>Trade-in Options Available:</Label>
        <SingleSelect
          value={formData.tradeInOptions ? "Yes" : "No"}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              tradeInOptions: value === "Yes",
            })
          }
        >
          <SelectTrigger className="w-2/3 mb-4">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </SingleSelect>
      </div>
      <div className="flex justify-between items-center gap-1">
        <Label className="w-1/3">Service & Warranty Information:</Label>
        <Textarea
          className="w-2/3 mb-4"
          value={formData.serviceWarrantyInfo}
          onChange={(e) =>
            setFormData({ ...formData, serviceWarrantyInfo: e.target.value })
          }
        />
      </div>
      {errors.serviceWarrantyInfo && <p className="text-red-500 text-sm mb-4">{errors.serviceWarrantyInfo}</p>}
      <div className="flex justify-between items-center">
        <Label>Registration Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.businessRegistrationNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              businessRegistrationNumber: e.target.value,
            })
          }
        />
      </div>
      {errors.businessRegistrationNumber && <p className="text-red-500 text-sm mb-4">{errors.businessRegistrationNumber}</p>}
      <div className="flex justify-between items-center">
        <Label>Business Name:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
        />
      </div>
      {errors.businessName && <p className="text-red-500 text-sm mb-4">{errors.businessName}</p>}
      <div className="flex justify-between items-center">
        <Label>Business Address:</Label>
        <Textarea
          className="w-2/3 mb-4"
          value={formData.businessAddress}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
        />
      </div>
      {errors.businessAddress && <p className="text-red-500 text-sm mb-4">{errors.businessAddress}</p>}
      <div className="flex justify-between items-center">
        <Label>Years in Business:</Label>
        <SingleSelect
          value={formData.yearsInBusiness}
          onValueChange={(value) =>
            setFormData({ ...formData, yearsInBusiness: value })
          }
        >
          <SelectTrigger className="w-2/3 mb-4">
            <SelectValue placeholder="Select years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-5">1-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </SingleSelect>
      </div>
      {errors.yearsInBusiness && <p className="text-red-500 text-sm mb-4">{errors.yearsInBusiness}</p>}
      <div className="flex justify-between items-center">
        <Label>Dealership License Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.dealershipLicenseNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              dealershipLicenseNumber: e.target.value,
            })
          }
        />
      </div>
      {errors.dealershipLicenseNumber && <p className="text-red-500 text-sm mb-4">{errors.dealershipLicenseNumber}</p>}
      <div className="flex justify-between items-center gap-1">
        <Label className="w-1/3">Car Brands Sold:</Label>
        <Select
          isMulti
          options={carBrandsOptions}
          value={
            formData.carBrandsSold?.length
              ? carBrandsOptions.filter((option) =>
                  formData.carBrandsSold?.includes(option.value)
                )
              : []
          }
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              carBrandsSold: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.carBrandsSold && <p className="text-red-500 text-sm mb-4">{errors.carBrandsSold}</p>}
      <div className="text-left mb-4">
        <Label className="w-1/3">New or Used Cars?</Label>
        <div className="flex justify-between items-center gap-1">
          <div className="flex gap-2">
            <Checkbox
              checked={formData.newOrUsedCars.new}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  newOrUsedCars: {
                    ...formData.newOrUsedCars,
                    new: checked ? true : false,
                  },
                })
              }
            />
            <Label className="w-1/3">New</Label>
          </div>
          
          <div className="flex gap-2">
            <Checkbox
              checked={formData.newOrUsedCars.used}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  newOrUsedCars: {
                    ...formData.newOrUsedCars,
                    used: checked ? true : false,
                  },
                })
              }
            />
            <Label className="w-1/3">Used</Label>
          </div>
          
          <div className="flex gap-2">
            <Checkbox
              checked={formData.newOrUsedCars.both}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  newOrUsedCars: {
                    ...formData.newOrUsedCars,
                    both: checked ? true : false,
                  },
                })
              }
            />
            <Label className="w-1/3">Both</Label>
          </div>
         
        </div>
      </div>
      {/* {errors.newOrUsedCars && <p className="text-red-500 text-sm mb-4">{errors.newOrUsedCars}</p>} */}
    </div>
  );
};

export default BusinessInformation; // Ensure single default export

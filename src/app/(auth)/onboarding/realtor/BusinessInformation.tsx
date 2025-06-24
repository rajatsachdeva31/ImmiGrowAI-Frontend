import React from "react";
import { FormData } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select, { MultiValue } from "react-select";
import {
  Select as SingleSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OptionType = { value: string; label: string };

const areasCoveredOptions: OptionType[] = [
  { value: "city", label: "City" },
  { value: "region", label: "Region" },
];

const specialtiesOptions: OptionType[] = [
  { value: "rentals", label: "Rentals" },
  { value: "sales", label: "Sales" },
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
  { value: "luxury", label: "Luxury Homes" },
];

const BusinessInformation: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string }; // Define errors as an object
}> = ({ formData, setFormData, errors }) => {

  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Business Information</h2>
      <div className="flex justify-between items-center">
        <Label>Business Name:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.businessName || ""}
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
          value={formData.businessAddress || ""}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
        />
      </div>
      {errors.businessAddress && <p className="text-red-500 text-sm mb-4">{errors.businessAddress}</p>}
      <div className="flex justify-between items-center">
        <Label>License Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.licenseNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, licenseNumber: e.target.value })
          }
        />
      </div>
      {errors.licenseNumber && <p className="text-red-500 text-sm mb-4">{errors.licenseNumber}</p>}
      <div className="flex justify-between items-center">
        <Label>Years of Experience:</Label>
        <SingleSelect
          value={formData.yearsOfExperience || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, yearsOfExperience: value })
          }
        >
          <SelectTrigger className="w-2/3 mb-4">
            <SelectValue placeholder="Select Years of Expereince" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-5">1-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </SingleSelect>
      </div>
      {errors.yearsOfExperience && <p className="text-red-500 text-sm mb-4">{errors.yearsOfExperience}</p>}
      <div className="flex justify-between items-center">
        <Label>Affiliated Associations:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.affiliatedAssociations || ""}
          onChange={(e) =>
            setFormData({ ...formData, affiliatedAssociations: e.target.value })
          }
        />
      </div>
      {errors.affiliatedAssociations && <p className="text-red-500 text-sm mb-4">{errors.affiliatedAssociations}</p>}
      <div className="flex justify-between items-center">
        <Label>Areas Covered:</Label>
        <Select
          isMulti
          options={areasCoveredOptions}
          value={areasCoveredOptions.filter((option) =>
            formData.areasCovered?.includes(option.value)
          )}
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              areasCovered: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.areasCovered && <p className="text-red-500 text-sm mb-4">{errors.areasCovered}</p>}
      <div className="flex justify-between items-center">
        <Label>Specialties:</Label>
        <Select
          isMulti
          options={specialtiesOptions}
          value={
            formData.specialties?.length
              ? specialtiesOptions.filter((option) =>
                  formData.specialties.includes(option.value)
                )
              : []
          }
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              specialties: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.specialties && <p className="text-red-500 text-sm mb-4">{errors.specialties}</p>}
      <div className="flex justify-between items-center">
        <Label>Portfolio/Website Link:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.portfolioLink || ""}
          onChange={(e) =>
            setFormData({ ...formData, portfolioLink: e.target.value })
          }
        />
      </div>
      {errors.portfolioLinkRequired && <p className="text-red-500 text-sm mb-4">{errors.portfolioLinkRequired}</p>}
      {errors.portfolioLink && <p className="text-red-500 text-sm mb-4">{errors.portfolioLink}</p>}
      <div className="flex justify-between items-center">
        <Label>Registration Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.registrationNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, registrationNumber: e.target.value })
          }
        />
      </div>
      {errors.registrationNumber && <p className="text-red-500 text-sm mb-4">{errors.registrationNumber}</p>}
    </div>
  );
};

export default BusinessInformation;

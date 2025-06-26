import React from "react";
import { FormData } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select, { MultiValue } from "react-select";
import {
  Select as SingleSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OptionType = { value: string; label: string };

const immigrationServicesOptions: OptionType[] = [
  { value: "IT", label: "IT" },
  { value: "Finance", label: "Finance" },
  { value: "Management", label: "Management" },
  { value: "Accounting", label: "Accounting" },
];

const languagesSpokenOptions: OptionType[] = [
  { value: "English", label: "Enlish" },
  { value: "French", label: "French" },
  { value: "Hindi", label: "Hindi" },
];

const countriesServedOptions: OptionType[] = [
  { value: "Canada", label: "Canada" },
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
];

const BusinessInformation: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string };
}> = ({ formData, setFormData, errors }) => {
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Business Information</h2>
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
      {errors.businessName && (
        <p className="text-red-500 text-sm mb-4">{errors.businessName}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>Business Address:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.businessAddress}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
        />
      </div>
      {errors.businessAddress && (
        <p className="text-red-500 text-sm mb-4">{errors.businessAddress}</p>
      )}
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
      {errors.businessRegistrationNumber && (
        <p className="text-red-500 text-sm mb-4">
          {errors.businessRegistrationNumber}
        </p>
      )}
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
      {errors.yearsOfExperience && (
        <p className="text-red-500 text-sm mb-4">{errors.yearsOfExperience}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>License Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.licenseNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              licenseNumber: e.target.value,
            })
          }
        />
      </div>
      {errors.licenseNumber && (
        <p className="text-red-500 text-sm mb-4">{errors.licenseNumber}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>Countries Served:</Label>
        <Select
          isMulti
          options={countriesServedOptions}
          value={
            formData.countriesServed?.length
              ? countriesServedOptions.filter((option) =>
                  formData.countriesServed.includes(option.value)
                )
              : []
          }
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              countriesServed: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.countriesServed && (
        <p className="text-red-500 text-sm mb-4">{errors.countriesServed}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>Mentorship Fee:</Label>
        <Input
          className="w-2/3 mb-4"
          type="number"
          value={formData.consultationFee}
          onChange={(e) =>
            setFormData({
              ...formData,
              consultationFee: Number(e.target.value),
            })
          }
        />
      </div>
      {errors.consultationFee && (
        <p className="text-red-500 text-sm mb-4">{errors.consultationFee}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>Partnered Legal Firms:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.partneredLegalFirms}
          onChange={(e) =>
            setFormData({ ...formData, partneredLegalFirms: e.target.value })
          }
        />
      </div>
      {errors.partneredLegalFirms && (
        <p className="text-red-500 text-sm mb-4">
          {errors.partneredLegalFirms}
        </p>
      )}
      <div className="flex justify-between items-center">
        <Label>Website Links:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.websiteLinks}
          onChange={(e) =>
            setFormData({ ...formData, websiteLinks: e.target.value })
          }
        />
      </div>
      {errors.websiteLinks && (
        <p className="text-red-500 text-sm mb-4">{errors.websiteLinks}</p>
      )}
      <div className="flex justify-between items-center">
        <Label>Mentoring Services:</Label>
        <Select
          isMulti
          options={immigrationServicesOptions}
          value={
            formData.immigrationServices?.length
              ? immigrationServicesOptions.filter((option) =>
                  formData.immigrationServices.includes(option.value)
                )
              : []
          }
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              immigrationServices: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.immigrationServices && (
        <p className="text-red-500 text-sm mb-4">
          {errors.immigrationServices}
        </p>
      )}
      <div className="flex justify-between items-center">
        <Label>Languages Spoken:</Label>
        <Select
          isMulti
          options={languagesSpokenOptions}
          value={
            formData.languagesSpoken?.length
              ? languagesSpokenOptions.filter((option) =>
                  formData.languagesSpoken.includes(option.value)
                )
              : []
          }
          onChange={(selectedOptions: MultiValue<OptionType>) =>
            setFormData({
              ...formData,
              languagesSpoken: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
            })
          }
          className="w-2/3 mb-4"
        />
      </div>
      {errors.languagesSpoken && (
        <p className="text-red-500 text-sm mb-4">{errors.languagesSpoken}</p>
      )}
    </div>
  );
};

export default BusinessInformation;

import React from "react";
import { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OfficeWorkSetup: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string };
}> = ({ formData, setFormData, errors }) => {
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Office & Work Setup</h2>

      <div className="flex justify-between items-center">
        <Label>Work Type:</Label>
        <RadioGroup
          className="flex gap-4  mb-4"
          value={formData.workType || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, workType: value })
          }
        >
          <RadioGroupItem value="brokerage" id="brokerage" />
          <Label htmlFor="brokerage" className="mr-4">
            Brokerage
          </Label>

          <RadioGroupItem value="independent" id="independent" />
          <Label htmlFor="independent">Independent</Label>
        </RadioGroup>
      </div>
      {errors.workType && <p className="text-red-500 text-sm mb-4">{errors.workType}</p>}

      {formData.workType === "brokerage" && (
        <div className="flex justify-between items-center">
          <Label>Brokerage Name:</Label>
          <Input
            type="text"
            className="w-2/3 mb-4"
            value={formData.brokerageName || ""}
            onChange={(e) =>
              setFormData({ ...formData, brokerageName: e.target.value })
            }
          />
        </div>
        
      )}
      {errors.brokerageName && <p className="text-red-500 text-sm mb-4">{errors.brokerageName}</p>}

      <div className="flex justify-between items-center">
        <Label>Office Location:</Label>
        <Select
          value={formData.officeLocationAvailability || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, officeLocationAvailability: value })
          }
        >
          <SelectTrigger className="w-2/3 mb-4">
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {errors.officeLocationAvailability && <p className="text-red-500 text-sm mb-4">{errors.officeLocationAvailability}</p>}

      <div className="flex justify-between items-center">
        <Label>Total Team Members:</Label>
        <Input
          type="number"
          className="w-2/3 mb-4"
          value={formData.numberOfTeamMembers || 1}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfTeamMembers: parseInt(e.target.value, 10),
            })
          }
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Label>Virtual Property Tour:</Label>
        <Select
          value={formData.virtualTourAvailability || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, virtualTourAvailability: value })
          }
        >
          <SelectTrigger className="w-2/3 mb-4">
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {errors.virtualTourAvailability && <p className="text-red-500 text-sm mb-4">{errors.virtualTourAvailability}</p>}
    </div>
  );
};

export default OfficeWorkSetup;

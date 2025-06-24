import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsAndConditionsProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  errors: { [key: string]: string };
}

const TermsAndConditions = <T extends Record<string, any>>({
  formData,
  setFormData,
  errors,
}: TermsAndConditionsProps<T>) => {
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.backgroundCheckApproved || false} // Ensure it's a boolean
            onCheckedChange={(checked) => {
              setFormData({
                ...formData,
                backgroundCheckApproved: !!checked, // Convert to boolean
              });
            }}
          />
          <Label>I approve the background check.</Label>
        </div>
        {errors.backgroundCheckApproved && (
          <p className="text-red-500 text-sm mb-4">
            {errors.backgroundCheckApproved}
          </p>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.termsAccepted || false} // Ensure it's a boolean
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                termsAccepted: !!checked, // Convert to boolean
              })
            }
          />
          <Label>I agree to the terms and conditions.</Label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mb-4">
            {errors.termsAccepted}
          </p>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DocumentUploadProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  errors: { [key: string]: string };
}

const DocumentUpload = <T extends Record<string, any>>({
  formData,
  setFormData,
  errors
}: DocumentUploadProps<T>) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof T
  ) => {
    if (e.target.files) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
      <div className="flex justify-between items-center">
        <Label>Government ID:</Label>
        <Input
          className="w-1/2 mb-4"
          type="file"
          onChange={(e) => handleFileChange(e, "governmentId")}
        />
      </div>
      {errors.governmentId && <p className="text-red-500 text-sm mb-4">{errors.governmentId}</p>}
      <div className="flex justify-between items-center">
        <Label>Business Verification:</Label>
        <Input
          className="w-1/2 mb-4"
          type="file"
          onChange={(e) => handleFileChange(e, "businessVerification")}
        />
      </div>
      {errors.businessVerification && <p className="text-red-500 text-sm mb-4">{errors.businessVerification}</p>}
      <div className="flex justify-between items-center">
        <Label>License Document:</Label>
        <Input
          className="w-1/2 mb-4"
          type="file"
          onChange={(e) => handleFileChange(e, "licenseDocument")}
        />
      </div>
      {errors.licenseDocument && <p className="text-red-500 text-sm mb-4">{errors.licenseDocument}</p>}
    </div>
  );
};

export default DocumentUpload;

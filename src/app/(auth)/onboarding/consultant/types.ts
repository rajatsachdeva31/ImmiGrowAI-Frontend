export interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  countriesServed: string[];
  consultationFee: number;
  businessRegistrationNumber: string;
  partneredLegalFirms: string;
  websiteLinks: string;
  businessName: string;
  businessAddress: string;
  yearsOfExperience: string;
  licenseNumber: string;
  immigrationServices: string[];
  languagesSpoken: string[];
  governmentId: string | Blob;
  businessVerification: string | Blob;
  licenseDocument: string | Blob;
  backgroundCheckApproved: boolean;
  termsAccepted: boolean;
}

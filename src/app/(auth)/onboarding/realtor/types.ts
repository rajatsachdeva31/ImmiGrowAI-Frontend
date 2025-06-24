export interface FormData {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  businessName: string;
  businessAddress: string;
  licenseNumber: string;
  yearsOfExperience: string;
  affiliatedAssociations: string;
  areasCovered: string[];
  specialties: string[];
  portfolioLink: string;
  registrationNumber: string;
  workType: string;
  brokerageName: string;
  officeLocationAvailability: string;
  numberOfTeamMembers: number;
  virtualTourAvailability: string;
  governmentId: string | Blob;
  businessVerification: string | Blob;
  licenseDocument: string | Blob;
  backgroundCheckApproved: boolean;
  termsAccepted: boolean;
}

export interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  showroomLocations: string;
  testDrivePolicy: string;
  vehicleFinancingOptions: {
    inHouseFinancing: boolean;
    thirdPartyBanks: boolean;
    leaseOptions: boolean;
  };
  tradeInOptions: boolean;
  serviceWarrantyInfo: string;
  businessRegistrationNumber: string;
  businessName: string;
  businessAddress: string;
  yearsInBusiness: string;
  dealershipLicenseNumber: string;
  carBrandsSold: string[];
  newOrUsedCars: {
    new: boolean;
    used: boolean;
    both: boolean;
  };
  governmentId: string | Blob;
  businessVerification: string | Blob;
  licenseDocument: string | Blob;
  backgroundCheckApproved: boolean;
  termsAccepted: boolean;
}

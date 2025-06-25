"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Load PDF.js worker locally
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type UserDetail = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  DOB: string;
  firebaseUid: string;
  userVerified: boolean;
  statusInCanada: string | null;
  roleId: number;
  userDocuments: { id: number }[];
  userType: string;
  // Realtor details from Prisma model
  realtor?: {
    businessName: string;
    businessAddress?: string;
    realEstateLicenseNumber: string;
    affiliatedAssociations?: string;
    areasCovered: string;
    specialties: string;
    portfolioWebsite?: string;
    businessRegistration: string;
    workType: string;
    brokerageName?: string;
    officeLocationAvailable: boolean;
    teamMembers: number;
    virtualPropertyTour: boolean;
    yearsOfExperience: string;
  };
  // Car Dealership details from Prisma model
  carDealership?: {
    showroomLocations: string;
    testDrivePolicy: string;
    financingOptions: string;
    tradeInAvailable: boolean;
    serviceWarrantyInfo: string;
    businessRegistration: string;
    businessName: string;
    yearsInBusiness: string;
    dealershipLicenseNumber: string;
    carBrandsSold: string;
    newOrUsedCars: string;
  };
  // Immigration Consultant details from Prisma model
  immigrationConsultant?: {
    countriesServed: string;
    consultationFee: number | null;
    businessRegistration: string;
    partneredLegalFirms?: string;
    websiteOrSocialMedia?: string;
    businessName: string;
    businessAddress: string;
    licenseNumber: string;
    servicesOffered: string;
    languagesSpoken: string;
    yearsOfExperience: string;
  };
};

export default function ViewUserPage() {
  const { id: userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [step, setStep] = useState(1);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const handleBack = () => router.push("/dashboard/admin/user-list");

  // Reset current page when step changes
  useEffect(() => {
    setCurrentPage(1);
  }, [step]);

  // Fetch user details on mount
  useEffect(() => {
    if (!userId || !endpoint) {
      setError("Missing userId or API endpoint.");
      setLoading(false);
      return;
    }
    async function fetchUserDetails() {
      try {
        const token = await fetchAuthToken();
        if (!token) throw new Error("Invalid token received");
        const response = await fetch(
          `${endpoint}api/admin/user-list/user-details/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUser(data.user);
        // For step 1, if a document exists, select the first one
        if (data.user.userDocuments.length > 0) {
          setSelectedDocId(data.user.userDocuments[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, [userId, endpoint]);

  // Update selected document when step changes
  useEffect(() => {
    if (!user) {
      setSelectedDocId(null);
      return;
    }
    // If fewer documents than the step number exist, clear the selection
    if (user.userDocuments.length < step) {
      setSelectedDocId(null);
    } else {
      if (step === 1) setSelectedDocId(user.userDocuments[0].id);
      else if (step === 2) setSelectedDocId(user.userDocuments[1].id);
      else if (step === 3) setSelectedDocId(user.userDocuments[2].id);
    }
  }, [step, user]);

  // Fetch PDF when selectedDocId changes
  useEffect(() => {
    if (selectedDocId) {
      fetchUserDocument(selectedDocId);
    } else {
      setDocumentUrl(null);
    }
  }, [selectedDocId]);

  async function fetchAuthToken(): Promise<string | null> {
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });
      if (!tokenResponse.ok)
        throw new Error("Failed to get authentication token");
      const tokenData = await tokenResponse.json();
      return tokenData.token;
    } catch (err: any) {
      return null;
    }
  }

  async function fetchUserDocument(documentId: number): Promise<void> {
    try {
      const token = await fetchAuthToken();
      if (!token) throw new Error("Invalid token received");
      // Revoke previous URL if exists
      if (documentUrl) URL.revokeObjectURL(documentUrl);
      const docUrl = `${endpoint}api/admin/user-list/user-document/${documentId}`;
      const response = await fetch(docUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      setDocumentUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setDocumentUrl(null);
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok)
        throw new Error("Failed to get authentication token");

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const response = await fetch(`${endpoint}api/admin/verify/verify-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) throw new Error("Failed to verify user");

      alert("User has been successfully verified!");

      router.push("/dashboard/admin/user-list");
    } catch (err: any) {
      console.error("Error verifying user:", err.message);
      alert("Failed to verify user. Please try again.");
    }
  };

  if (loading) return <div className="p-5">Loading user details...</div>;
  if (error) return <div className="p-5 text-red-600">Error: {error}</div>;

  // Helper: PDF Viewer with navigation buttons and a key to force re-mounting
  const renderPDFViewer = (title: string) => (
    <div className="p-5 border rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {documentUrl ? (
        <div onContextMenu={(e) => e.preventDefault()} className="border p-3">
          <Document
            key={`doc-${step}-${selectedDocId}`}
            file={documentUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              {currentPage} of {numPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, numPages || 1))
              }
              disabled={numPages === null || currentPage >= (numPages || 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No document available.</p>
      )}
    </div>
  );

  // Render step content in a 50/50 layout
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: User Details */}
          <div className="p-5 border rounded shadow-sm">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {user?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phoneNo}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(user?.DOB || "").toLocaleDateString()}
            </p>
            <p>
              <strong>Status in Canada:</strong> {user?.statusInCanada || "N/A"}
            </p>
            <p>
              <strong>Verified:</strong> {user?.userVerified ? "Yes" : "No"}
            </p>
          </div>
          {/* Right: Government ID PDF */}
          {renderPDFViewer("Government ID")}
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Business Details */}
          <div className="p-5 border rounded shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Business Details</h2>
            {user.realtor ? (
              <>
                <p>
                  <strong>Business Name:</strong> {user.realtor.businessName}
                </p>
                <p>
                  <strong>Business Address:</strong>{" "}
                  {user.realtor.businessAddress || "N/A"}
                </p>
                <p>
                  <strong>Real Estate License Number:</strong>{" "}
                  {user.realtor.realEstateLicenseNumber}
                </p>
                <p>
                  <strong>Affiliated Associations:</strong>{" "}
                  {user.realtor.affiliatedAssociations || "N/A"}
                </p>
                <p>
                  <strong>Areas Covered:</strong> {user.realtor.areasCovered}
                </p>
                <p>
                  <strong>Specialties:</strong> {user.realtor.specialties}
                </p>
                <p>
                  <strong>Portfolio Website:</strong>{" "}
                  {user.realtor.portfolioWebsite ? (
                    <a
                      href={user.realtor.portfolioWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {user.realtor.portfolioWebsite}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Business Registration:</strong>{" "}
                  {user.realtor.businessRegistration}
                </p>
                <p>
                  <strong>Work Type:</strong> {user.realtor.workType}
                </p>
                <p>
                  <strong>Brokerage Name:</strong>{" "}
                  {user.realtor.brokerageName || "N/A"}
                </p>
                <p>
                  <strong>Office Location Available:</strong>{" "}
                  {user.realtor.officeLocationAvailable ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Team Members:</strong> {user.realtor.teamMembers}
                </p>
                <p>
                  <strong>Virtual Property Tour:</strong>{" "}
                  {user.realtor.virtualPropertyTour ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Years of Experience:</strong>{" "}
                  {user.realtor.yearsOfExperience}
                </p>
              </>
            ) : user.carDealership ? (
              <>
                <p>
                  <strong>Business Name:</strong>{" "}
                  {user.carDealership.businessName}
                </p>
                <p>
                  <strong>Showroom Locations:</strong>{" "}
                  {user.carDealership.showroomLocations}
                </p>
                <p>
                  <strong>Test Drive Policy:</strong>{" "}
                  {user.carDealership.testDrivePolicy}
                </p>
                <p>
                  <strong>Financing Options:</strong>{" "}
                  {(() => {
                    try {
                      const options = JSON.parse(
                        user.carDealership.financingOptions
                      );
                      return `In House Financing: ${
                        options.inHouseFinancing ? "Yes" : "No"
                      }, Third Party Banks: ${
                        options.thirdPartyBanks ? "Yes" : "No"
                      }, Lease Options: ${options.leaseOptions ? "Yes" : "No"}`;
                    } catch (error) {
                      return user.carDealership.financingOptions;
                    }
                  })()}
                </p>
                <p>
                  <strong>Trade In Available:</strong>{" "}
                  {user.carDealership.tradeInAvailable ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Service Warranty Info:</strong>{" "}
                  {user.carDealership.serviceWarrantyInfo}
                </p>
                <p>
                  <strong>Business Registration:</strong>{" "}
                  {user.carDealership.businessRegistration}
                </p>
                <p>
                  <strong>Years in Business:</strong>{" "}
                  {user.carDealership.yearsInBusiness}
                </p>
              </>
            ) : user.immigrationConsultant ? (
              <>
                <p>
                  <strong>Business Name:</strong>{" "}
                  {user.immigrationConsultant.businessName}
                </p>
                <p>
                  <strong>Business Address:</strong>{" "}
                  {user.immigrationConsultant.businessAddress}
                </p>
                <p>
                  <strong>License Number:</strong>{" "}
                  {user.immigrationConsultant.licenseNumber}
                </p>
                <p>
                  <strong>Countries Served:</strong>{" "}
                  {user.immigrationConsultant.countriesServed}
                </p>
                <p>
                  <strong>Mentorship Fee:</strong>{" "}
                  {user.immigrationConsultant.consultationFee}
                </p>
                <p>
                  <strong>Business Registration:</strong>{" "}
                  {user.immigrationConsultant.businessRegistration}
                </p>
                <p>
                  <strong>Partnered Legal Firms:</strong>{" "}
                  {user.immigrationConsultant.partneredLegalFirms || "N/A"}
                </p>
                <p>
                  <strong>Website/Social Media:</strong>{" "}
                  {user.immigrationConsultant.websiteOrSocialMedia ? (
                    <a
                      href={user.immigrationConsultant.websiteOrSocialMedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {user.immigrationConsultant.websiteOrSocialMedia}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Years of Experience:</strong>{" "}
                  {user.immigrationConsultant.yearsOfExperience}
                </p>
                <p>
                  <strong>Services Offered:</strong>{" "}
                  {user.immigrationConsultant.servicesOffered}
                </p>
                <p>
                  <strong>Languages Spoken:</strong>{" "}
                  {user.immigrationConsultant.languagesSpoken}
                </p>
              </>
            ) : (
              <p>No business details available.</p>
            )}
          </div>
          {/* Right: Business Info PDF */}
          {renderPDFViewer("Business Info Document")}
        </div>
      );
    } else if (step === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: License Details */}
          <div className="p-5 border rounded shadow-sm">
            <h2 className="text-2xl font-bold mb-4">License Details</h2>
            {user.realtor ? (
              <p>
                <strong>License Number:</strong>{" "}
                {user.realtor.realEstateLicenseNumber}
              </p>
            ) : user.carDealership ? (
              <p>
                <strong>Dealership License Number:</strong>{" "}
                {user.carDealership.dealershipLicenseNumber}
              </p>
            ) : user.immigrationConsultant ? (
              <p>
                <strong>License Number:</strong>{" "}
                {user.immigrationConsultant.licenseNumber}
              </p>
            ) : (
              <p>No license details available.</p>
            )}
          </div>
          {/* Right: License Document PDF */}
          {renderPDFViewer("License Document")}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-5">
      {/* Back to Users Button */}
      <button
        onClick={handleBack}
        className="px-4 py-2 rounded hover:bg-gray-200 transition mb-5"
      >
        ← Back to Users
      </button>

      {/* Step Navigation */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
          disabled={step === 1}
          className={`px-4 py-2 rounded ${
            step === 1
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          ← Previous
        </button>
        <span className="text-lg font-semibold">
          {step === 1
            ? "User Details"
            : step === 2
            ? "Business Details"
            : "License Details"}
        </span>
        <button
          disabled={step === 3 && user?.userVerified === true}
          onClick={() =>
            step === 3 ? setShowModal(true) : setStep((prev) => prev + 1)
          }
          className={`px-4 py-2 rounded ${
            step === 3 && user?.userVerified === true
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {step === 3 ? "Verify User" : "Next →"}
        </button>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Confirm Verification</h2>
            <p>Are you sure you want to verify this user?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyUser(user.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

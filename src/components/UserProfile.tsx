// /app/profile/UserProfile.tsx
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface UserProfileProps {
  userData: {
    fullName: string;
    DOB: string;
    phoneNo: string;
    email: string;
    roleId: number;
    role: string;
    alreadyInCanada?: boolean | null;
    statusInCanada?: string | null;
    countryOfOrigin?: string | null;
    currentLocation?: string | null;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  return (
    <div className="max-w-5xl  mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
      {/* Card 1 - Profile Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 flex flex-col justify-center items-center text-white">
          <UserCircleIcon className="w-24 h-24 mb-4" />
          <h2 className="text-xl font-bold">{userData.fullName}</h2>
          <p className="text-sm">{userData.role.name}</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600 font-semibold">Date of Birth</p>
          <p className="text-gray-600 text-center">{new Date(userData.DOB).toLocaleDateString()}</p>
          <p className="text-gray-600 font-semibold mt-4">Phone Number</p>
          <p className="text-gray-600 text-center">{userData.phoneNo}</p>
        </div>
      </div>

      {/* Card 2 - Email and Status */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mt-12">
        <h3 className="text-lg text-center font-bold mb-4">Additional Information</h3>
        {userData.roleId === 1 && (
          <>
            <div className="mb-4">
              <p className="text-gray-600 text-center font-semibold">Email</p>
              <p className="text-gray-600 text-center">{userData.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-center font-semibold">Already In Canada</p>
              <p className="text-gray-600 text-center">{userData.alreadyInCanada ? "Yes" : "No"}</p>
            </div>
            {userData.alreadyInCanada && (<div className="mb-4">
              <p className="text-gray-600 text-center font-semibold">Status In Canada</p>
              <p className="text-gray-600 text-center">{userData.statusInCanada || "N/A"}</p>
            </div>
            )}
            </>
       
          
        )}
         </div>
      </div>

      {/* Card 3 - Country and Location */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mt-14">
        <h3 className="text-lg text-center font-bold mb-4">Location Information</h3>
        {userData.roleId === 1 && (
          <>
            <div className="mb-4">
              <p className="text-gray-600 text-center font-semibold">Country of Origin</p>
              <p className="text-gray-600 text-center">{userData.countryOfOrigin || "N/A"}</p>
            </div>
            {userData.alreadyInCanada && ( <div className="mb-4">
              <p className="text-gray-600 text-center font-semibold">School/Work Location</p>
              <p className="text-gray-600 text-center">{userData.currentLocation || "N/A"}</p>
            </div>)}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

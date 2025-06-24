"use client";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function NotVerified() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  let message = "";
  if (reason === "user") {
    message = "Your account verification is pending.";
  }
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        <FaCheckCircle className="text-blue-500 w-16 h-16 mx-auto" />
        <h1 className="text-2xl font-semibold mt-4">
          Form Submitted Successfully!
        </h1>
        <p className="text-gray-600 mt-2">{`${message} We will notify you once the process is complete.`}</p>
      </div>
    </div>
  );
}

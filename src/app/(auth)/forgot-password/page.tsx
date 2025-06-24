"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ForgotPassword = () => {
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${endpoint}api/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      if (data.message) {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full md:flex">
      <div className="w-full p-12 h-full flex flex-col justify-center items-center">
        <div className="max-w-md lg:max-w-lg">
          <div className=" py-8 px-6 shadow shadow-muted-foreground rounded-lg sm:px-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Forgot Password?</h2>
            <p className=" mb-8">Enter your email and password below</p>
            <Input
              placeholder="email"
              className="mb-4"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className={
                "bg-blue-600 hover:bg-blue-500 w-full mb-4" +
                (loading
                  ? " cursor-not-allowed bg-blue-300 hover:bg-blue-300"
                  : "")
              }
              onClick={(e) => handleForgotPassword(e)}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Verify"}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-md mt-6 pt-6 border-t">
              Remember Password?{" "}
              <Link
                className="text-blue-600 hover:text-blue-500 font-semibold"
                href="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

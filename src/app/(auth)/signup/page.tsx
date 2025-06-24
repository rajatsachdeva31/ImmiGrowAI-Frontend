"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Image from "next/image";

const endpoint = process.env.NEXT_PUBLIC_API_URL;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const secret = process.env.NEXT_PUBLIC_SECRET_KEY;

  function encryptPassword(password: string) {
    if (!secret) {
      throw new Error("Secret key is not defined");
    }
    // Generate a random IV and convert it to a hexadecimal string
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

    // Encrypt the password using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Utf8.parse(secret), // Parse the secret key as UTF-8
      {
        iv: CryptoJS.enc.Hex.parse(iv), // Parse the IV as hexadecimal
        mode: CryptoJS.mode.CBC, // Use CBC mode
        padding: CryptoJS.pad.Pkcs7, // Use PKCS7 padding
      }
    );

    // Return the encrypted password and IV
    return {
      encryptedData: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: iv,
    };
  }

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    if (!email || !password) {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Encrypt the password
    const { encryptedData, iv } = encryptPassword(password);

    try {
      // Send encrypted password and IV to the backend
      const response = await fetch(`${endpoint}api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: encryptedData, iv }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "EMAIL_EXISTS") {
          setError("Email already exists");
        } else {
          setError(data.error || "Failed to signup");
        }
        return;
      }

      if (data.userId) {
        localStorage.setItem("user", JSON.stringify(data.userId));
        toast({
          title: "Signup success",
          description: "Please verify your email before logging in",
        });
        router.push("/login");
      } else {
        setError(data.error || "Failed to signup");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  };

  const app = initializeApp(firebaseConfig);

  const handleGoogleSignup = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();
      const response = await fetch(`${endpoint}api/users/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.user) {
        localStorage.setItem("token", idToken);
        // localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/onboarding");
      } else {
        setError(data.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error(
        "Error during Google Sign-In or backend communication:",
        error
      );
      setError("Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full md:flex">
      <div className="w-1/2  bg-blue-600 md:flex flex-col justify-between hidden">
        <div className="relative h-full flex flex-col items-center justify-center">
          {/* ✅ Background Image with Overlay */}
          <div className="absolute inset-0 opacity-50">
            <Image
              src={"/signup.jpg"} // 🔹 Ensure the correct image path
              alt="signup"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <div className="md:w-1/2 p-12 h-full flex flex-col justify-center items-center">
        <div className="max-w-md lg:max-w-lg">
          <div className=" py-8 px-6 shadow shadow-muted-foreground rounded-lg sm:px-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Create an account</h2>
            <p className=" mb-8">
              Enter your email below to create your account
            </p>
            <Input
              placeholder="email"
              className="mb-4"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              className="mb-4"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className={
                "bg-blue-600 hover:bg-blue-500 w-full mb-4" +
                (loading
                  ? " cursor-not-allowed bg-blue-300 hover:bg-blue-300"
                  : "")
              }
              onClick={(e) => handleSignup(e)}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Sign up with Email"
              )}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex items-center mb-4">
              <div className="flex-grow h-px" />
              <span className="mx-4 text-sm">OR</span>
              <div className="flex-grow h-px" />
            </div>
            <Button
              variant="outline"
              className={
                "flex items-center justify-center w-full mb-4" +
                (loading
                  ? " cursor-not-allowed bg-neutral-300 hover:bg-neutral-300"
                  : "")
              }
              onClick={() => handleGoogleSignup()}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FcGoogle size={6} /> Continue with Google
                </>
              )}
            </Button>
            <p className="text-xs mt-4">
              By clicking signup, you agree to our Terms of Service and Privacy
              Policy.
            </p>
            <p className="text-md mt-6 pt-6 border-t">
              Already have an account?{" "}
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

export default Signup;

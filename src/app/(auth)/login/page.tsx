"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import CryptoJS from "crypto-js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import Image from "next/image";

// Define the UserData interface for checking user verification
interface UserData {
  emailVerified: boolean;
  userVerified: boolean;
  onboarded: boolean;
  userRole?: string;
}

const endpoint = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // const [token, setToken] = useState("");
  const { toast } = useToast();

  const router = useRouter();
  const secret = process.env.NEXT_PUBLIC_SECRET_KEY;

  function encryptPassword(password: string) {
    if (!secret) {
      throw new Error("Secret key is not defined");
    }
    const iv = CryptoJS.lib.WordArray.random(16).toString(); // Random IV
    const encrypted = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Utf8.parse(secret),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return {
      encryptedData: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: iv,
    };
  }

  const checkUserVerification = (data: UserData) => {
    if (data.onboarded === false) {
      router.push("/onboarding");
      return false;
    } else if (!data.userVerified) {
      router.push("/dashboard/not-verified?reason=user");
      return false;
    } else {
      if (data.userRole === "Car Dealership") {
        router.push("/dashboard/car-dealer");
        return false;
      } else if (data.userRole === "Immigrant") {
        router.push("/dashboard/user");
        return false;
      } else if (data.userRole === "Realtor") {
        router.push("/dashboard/realtor");
        return false;
      } else if (data.userRole === "Immigration Consultant") {
        router.push("/dashboard/consultant");
        return false;
      } else if (data.userRole === "Admin") {
        router.push("/dashboard/admin");
        return false;
      }

      return true;
    }
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

    const { encryptedData, iv } = encryptPassword(password);

    try {
      const response = await fetch(`${endpoint}api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password: encryptedData, iv }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.emailVerified == false) {
          setError("Please verify your email first");
          // setToken(data.token);
          setShowDialog(true);
          return;
        }
        setError(data.error || "Failed to login");
        return;
      }

      if (data.emailVerified == true) {
        if (rememberMe) {
          localStorage.setItem("email", data.email);
        }
        if (!checkUserVerification(data)) return;
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await fetch(`${endpoint}api/users/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });
      if (!tokenResponse.ok)
        throw new Error("Failed to get authentication token");

      const tokenData = await tokenResponse.json();
      const token = tokenData?.token;
      if (!token) throw new Error("Invalid authentication token");

      await fetch(`${endpoint}api/users/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to resend email:", error);
    }
  };

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  };

  const app = initializeApp(firebaseConfig);

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const rememberMe = false;

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const refreshToken = await result.user.refreshToken;
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${endpoint}api/users/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idToken, refreshToken, rememberMe }),
      });

      const data = await response.json();

      if (data) {
        localStorage.setItem("token", idToken);
        if (!checkUserVerification(data)) return;
        router.push("/dashboard");
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
    <>
      <div className="h-full md:flex">
        <div className="md:w-1/2 p-12 h-full flex flex-col justify-center items-center">
          <div className="max-w-md lg:max-w-lg">
            <div className=" py-8 px-6 shadow shadow-muted-foreground rounded-lg sm:px-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Login to your account</h2>
              <p className=" mb-8">Enter your email and password below</p>
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
              {/* <div className="flex items-center space-x-2 my-4 px-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked ? true : false)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </Label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>} */}
              <Button
                className={
                  "bg-blue-600 hover:bg-blue-500 w-full mb-4" +
                  (loading
                    ? " cursor-not-allowed bg-blue-300 hover:bg-blue-300"
                    : "")
                }
                onClick={(e) => handleLogin(e)}
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Login"}
              </Button>
              <p className="text-sm mb-4">
                Forgot Password?{" "}
                <Link
                  href={"/forgot-password"}
                  className="font-bold text-blue-600 hover:text-blue-500"
                >
                  Reset
                </Link>
              </p>
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
                onClick={() => handleGoogleLogin()}
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
                By clicking login, you agree to our Terms of Service and Privacy
                Policy.
              </p>
              <p className="text-md mt-6 pt-6 border-t">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-blue-600 hover:text-blue-500 font-semibold"
                  href="/signup"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-1/2 p-12 bg-blue-600 md:flex flex-col justify-between hidden">
          <Image
            src={"/login.jpg"}
            alt="signup"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 opacity-50"
          />
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification Required</DialogTitle>
          </DialogHeader>
          <p>Please verify your email to continue.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResendEmail}>
              Resend Verification Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;

import Image from "next/image";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React from "react";
// import logo from "./public/logo.svg";

const Logo = ({ path }: { path: string }) => {
  // const pathname = usePathname();
  const isProtectedPath =
  path?.startsWith("/dashboard") || path?.startsWith("/onboarding");
  return (
    <Link
      className="flex gap-1 justify-center items-center"
      href={isProtectedPath ? path : "/"}
    >
      <Image src={"/logo.svg"} width={40} height={40} alt="immigrateX" />
      <p className="text-3xl font-bold tracking-tighter">immigrateX</p>
    </Link>
  );
};

export default Logo;

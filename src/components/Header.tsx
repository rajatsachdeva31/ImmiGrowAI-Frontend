"use client";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isProtectedPath =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/onboarding");

  return (
    <header className="border-b border-border px-4 md:px-8 py-4 sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex justify-between items-center">
        <Logo path={pathname} />
        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}

        {pathname.endsWith("/") && (
          <div className="hidden md:flex items-center gap-12">
            <Link href="#about">About</Link>
            <Link href="#testimonials">Testimonials</Link>
            <Link href="#contact">Contact</Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* <ThemeSwitcher /> */}
          <Button className="bg-blue-600 hover:bg-blue-500">
            <Link href={isProtectedPath ? "/login" : "/login"}>
              {isProtectedPath ? "Logout" : "Login"}
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 px-4 py-4">
          {pathname.endsWith("/") && (
            <>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </>
          )}
          <div className="flex flex-col items-center gap-4 mt-4">
            <ThemeSwitcher />
            <Button className="bg-blue-600 hover:bg-blue-500">
              <Link href={isProtectedPath ? "/logout" : "/login"}>
                {isProtectedPath ? "Logout" : "Login"}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

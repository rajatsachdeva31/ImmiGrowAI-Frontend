import React from "react";
import Logo from "@/components/Logo";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="container mx-auto text-center py-10">
      <div className="flex justify-evenly flex-wrap">
        <div className="flex flex-col">
          <Logo path="/" />
          <p className="text-sm mt-2">&copy; 2025 ImmiGrow.A.I</p>
          <p className="text-sm">Edmonton, Alberta, Canada</p>
        </div>
        <div>
          <div className="flex justify-center mt-4 space-x-4">
            <Link
              href="https://www.linkedin.com/showcase/ImmiGrow-a-i/"
              aria-label="Linkedin"
            >
              <IoLogoLinkedin size={30} />
            </Link>
            <Link href="#" aria-label="X">
              <FaXTwitter size={30} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <FaInstagram size={30} />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 px-4 text-sm">
        <p className="font-semibold">Land Acknowledgment</p>
        <p className="mt-2 md:px-40">
          At ImmiGrow.ai, we acknowledge that we operate on the traditional
          territories of Indigenous Peoples across Canada. We honor the rich
          history, culture, and contributions of First Nations, Métis, and Inuit
          communities. We are committed to fostering respectful relationships
          with Indigenous Peoples and recognizing their enduring presence and
          rights within their ancestral lands. As we work to support newcomers
          in their journey to Canada, we strive to promote equity, inclusion,
          and understanding for all.
        </p>
      </div>
    </footer>
  );
}

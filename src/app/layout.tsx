import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
//import { ThemeProvider } from "@/components/providers/theme-provider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Header from "@/components/Header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: [],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ImmiGrow",
  description: "ImmiGrow",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased overscroll-y-none overscroll-none`}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

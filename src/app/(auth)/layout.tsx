import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import React, { ReactNode } from "react";

async function Layout({ children }: { children: ReactNode }) {

  return (
    <div className="flex flex-col h-screen min-w-full bg-background">
      <Header />
      <main className="w-full h-full">{children}</main>
      <Toaster />
    </div>
  );
}

export default Layout;

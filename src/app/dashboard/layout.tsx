import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import React, { ReactNode } from "react";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen min-w-full bg-background">
      <Header />
      <main className="w-full h-full">{children}</main>
    </div>
  );
}

export default Layout;

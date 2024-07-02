import React from "react";
import Aside from "./_components/aside";
import { Metadata } from "next";
import Navbar from "./_components/navbar";

export const metadata: Metadata = {
  title: "Dashboard | cliptext.com",
  description: "Your video and audio clip to text",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="w-full h-full bg-slate-50">
      <Aside />

      <div className="ml-14 h-full flex flex-col">
        <Navbar />

        <div className="flex-1">
          <div className="w-full h-[calc(100%-80px)] p-6">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;

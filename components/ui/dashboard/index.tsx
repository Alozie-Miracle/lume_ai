"use client";
import dynamic from "next/dynamic";
import React from "react";

const Dashboard = dynamic(() => import("@/components/ui/dashboard/dashboard"), {
  ssr: false, // prevent server-side rendering
});

const Index = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Index;
// export const BASE_URL = "http://localhost:5000/api/v1";

import dynamic from "next/dynamic";
import React from "react";

const Dashboard = dynamic(() => import("@/components/ui/dashboard/dashboard"), {
  ssr: false, // prevent server-side rendering
});

const Page = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;

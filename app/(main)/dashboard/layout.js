import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const Layout = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-6xl mx-auto">
      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Workstation
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base">
          Organize and manage your AI workspaces efficiently
        </p>
      </div>

      {/* PAGE CONTENT */}
      <Suspense
        fallback={
          <div className="mt-6">
            <BarLoader color="#3B82F6" width="100%" />
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default Layout;
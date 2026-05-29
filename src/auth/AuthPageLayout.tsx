import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
              <img src="/images/shape/grid-01.svg" alt="grid" />
            </div>
            <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
              <img src="/images/shape/grid-01.svg" alt="grid" />
            </div>
            
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <h1 className="text-4xl font-bold text-white tracking-wide">
                  Feedple <span className="text-brand-500">AI</span>
                </h1>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                The ultimate multi-tenant B2B platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

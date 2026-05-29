import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-outfit overflow-hidden selection:bg-purple-500/30 flex flex-col">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-brand-600/20 blur-[100px]"></div>
      </div>

      <Header />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}

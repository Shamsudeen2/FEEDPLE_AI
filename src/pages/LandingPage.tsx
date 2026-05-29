import { Link } from "react-router-dom";
import { BoltIcon, GroupIcon, BoxIcon, ArrowRightIcon } from "../icons";
import PublicLayout from "../components/public/PublicLayout";

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative z-10 pt-40 pb-20 sm:pt-56 sm:pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-sm animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Feedple AI 2.0 is now live
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-[6rem] leading-[1.1] font-bold tracking-tight mb-8">
          The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-brand-400">multi-tenant</span><br className="hidden sm:block" />
          B2B platform.
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-2xl text-gray-400 leading-relaxed mb-12">
          Securely connect databases, configure automated rules, and launch targeted campaigns from isolated workspaces powered by AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            Start Building Free
            <div className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform">
              <ArrowRightIcon />
            </div>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-200 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Features Glassmorphism Grid */}
      <div id="features" className="relative z-10 py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Engineered for Intelligence</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Everything you need to scale your SaaS infrastructure with powerful AI integrations built natively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500">
                  <div className="size-6">
                    <GroupIcon />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Isolated Workspaces</h3>
                <p className="text-gray-400 leading-relaxed">
                  Zero cross-tenant data exposure. Every company gets their own secure workspace with robust role-based access control.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm overflow-hidden md:-translate-y-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 mb-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                  <div className="size-6">
                    <BoxIcon />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-Time Sync</h3>
                <p className="text-gray-400 leading-relaxed">
                  Connect your PostgreSQL database, map your tables, and sync your customer data effortlessly in real-time.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-brand-500/30 transition-all duration-500 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 mb-8 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform duration-500">
                  <div className="size-6">
                    <BoltIcon />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Automated AI</h3>
                <p className="text-gray-400 leading-relaxed">
                  Configure inactivity rules and let Feedple evaluate behavior to automatically dispatch highly targeted campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
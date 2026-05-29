import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-6 sm:px-12 border-t border-white/10 mt-12 bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Feedple AI
          </h2>
        </Link>
        <p className="text-gray-500 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Feedple AI. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">
            Create Account
          </Link>
          <Link to="/signin" className="text-sm text-gray-400 hover:text-white transition-colors">
            Log In
          </Link>
        </div>
      </div>
    </footer>
  );
}

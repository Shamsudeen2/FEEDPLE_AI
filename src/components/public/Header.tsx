import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="fixed w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Feedple <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
            </h1>
          </Link>
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link
              to="/signin"
              className="text-gray-400 hover:text-white font-medium text-sm transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="relative inline-flex h-10 items-center justify-center px-6 py-2 overflow-hidden font-medium text-white rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <span className="relative z-10 text-sm">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function SidebarWidget() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth");
      sessionStorage.removeItem("authToken");
    } catch {
      // ignore storage errors
    }
    navigate("/signin");
  }, [navigate]);

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Purchase Plan
      </a>

      <div className="mt-3">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

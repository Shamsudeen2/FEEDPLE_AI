export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white/90">
            Feedple AI Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back to your workspace. Here is an overview of your
            activity.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Placeholder cards for future metrics */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
            {/* Icon placeholder */}
            <div className="h-6 w-6 text-brand-500">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-gray-800 dark:text-white/90">
                0
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Campaigns
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
            {/* Icon placeholder */}
            <div className="h-6 w-6 text-blue-500">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 18H5V4h14v16zM11 6h2v12h-2zm-4 4h2v8H7zm8-6h2v14h-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-gray-800 dark:text-white/90">
                0
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Emails Sent
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-xl bg-green-50 dark:bg-green-500/10">
            {/* Icon placeholder */}
            <div className="h-6 w-6 text-green-500">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-gray-800 dark:text-white/90">
                1
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

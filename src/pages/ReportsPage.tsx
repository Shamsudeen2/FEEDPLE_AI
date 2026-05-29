export default function ReportsPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">View your campaign and audience reports in one place.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Performance Snapshot</h2>
          <p className="text-gray-500 dark:text-gray-400">Quick overview of campaign performance, delivery, and engagement metrics.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h2>
          <p className="text-gray-500 dark:text-gray-400">Latest reports from your active campaigns and imported audiences.</p>
        </div>
      </div>
    </div>
  );
}

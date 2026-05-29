export default function HelpPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Documentation & Help</h1>
        <p className="text-gray-600 dark:text-gray-400">Find onboarding guides, FAQ, and user resources for Feedple AI.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h2>
          <p className="text-gray-500 dark:text-gray-400">Learn how to connect your first database and launch your first campaign.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Support</h2>
          <p className="text-gray-500 dark:text-gray-400">Access support articles, tutorials, and contact information for your workspace.</p>
        </div>
      </div>
    </div>
  );
}

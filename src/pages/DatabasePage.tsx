import { useEffect, useState } from "react";

type DBType =
  | "PostgreSQL"
  | "MySQL"
  | "SQLite"
  | "MongoDB"
  | "BigQuery"
  | "Redshift";

interface Connection {
  id: string;
  name: string;
  type: DBType;
  host?: string;
  port?: string;
  user?: string;
  database?: string;
  status: "Connected" | "Pending" | "Disconnected";
}

const SUPPORTED_DBS: DBType[] = [
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MongoDB",
  "BigQuery",
  "Redshift",
];

const STORAGE_KEY = "feedple_databases";

function loadConnections(): Connection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load saved connections", e);
  }
  return [];
}

export default function DatabasePage() {
  const [connections, setConnections] = useState<Connection[]>(loadConnections);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Connection>>({
    type: "PostgreSQL",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
    } catch (e) {
      console.warn("Failed to save connections", e);
    }
  }, [connections]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function addConnection() {
    setError("");
    if (!form.name?.trim()) {
      setError("Connection name is required");
      return;
    }
    if (!form.type) {
      setError("Database type is required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newConn: Connection = {
        id: String(Date.now()) + Math.floor(Math.random() * 1000),
        name: form.name || `${form.type} source`,
        type: form.type as DBType,
        host: form.host || undefined,
        port: form.port || undefined,
        user: form.user || undefined,
        database: form.database || undefined,
        status: "Pending",
      };
      setConnections((s) => [newConn, ...s]);
      setSuccess("Data source added successfully!");
      setShowForm(false);
      setForm({ type: "PostgreSQL", name: "" });
      setLoading(false);
    }, 300);
  }

  function removeConnection(id: string) {
    setConnections((s) => s.filter((c) => c.id !== id));
    setSuccess("Connection removed");
    setDeleteConfirm(null);
  }

  return (
    <div className="w-full">
      {success && (
        <div className="fixed inset-x-0 top-4 z-40 mx-auto max-w-sm rounded-lg bg-emerald-50 p-4 shadow-lg dark:bg-emerald-900/20 sm:top-6">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {success}
          </p>
        </div>
      )}
      {error && (
        <div className="fixed inset-x-0 top-4 z-40 mx-auto max-w-sm rounded-lg bg-red-50 p-4 shadow-lg dark:bg-red-900/20 sm:top-6">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}
      <div className="mb-6 px-4 sm:mb-8 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:text-3xl">
          Database
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Connect and manage your workspace data sources in one place.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-3xl sm:p-6 mb-4 sm:text-xl">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 sm:text-xl">
          Next step
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 sm:text-sm">
          Add a new data source or review your existing connections to keep your
          workspace synced.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 active:bg-brand-800 sm:px-5 sm:py-3"
          >
            Add Data Source
          </button>
          <a
            href="#connections"
            className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-5 sm:py-3"
          >
            View Connections
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
            <h3 className="text-xs font-semibold text-gray-800 dark:text-white mb-2 sm:text-sm">
              Supported databases
            </h3>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300 sm:space-y-2 sm:text-sm">
              {SUPPORTED_DBS.map((d) => (
                <li key={d} className="flex items-center justify-between">
                  <span>{d}</span>
                  <span className="text-xs text-gray-500">We accept</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
            <h3 className="text-xs font-semibold text-gray-800 dark:text-white mb-2 sm:text-sm">
              Quick actions
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="text-xs text-left text-brand-600 hover:underline sm:text-sm"
              >
                Add new connection
              </button>
              <button
                onClick={() => setConnections([])}
                className="text-xs text-left text-red-600 hover:underline sm:text-sm"
              >
                Clear all connections
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 grid gap-4 sm:mx-0 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-3xl sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 sm:text-xl">
                Connection Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 sm:text-sm">
                Your data sources are ready to sync with Feedple AI. Add or
                update connections below.
              </p>
            </div>
            <div className="hidden sm:block">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 active:bg-brand-800"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {connections.length === 0 && (
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  No connections yet
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                  Click Add to create a new data source
                </p>
              </div>
            )}

            {connections.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:rounded-2xl sm:gap-3 sm:p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate sm:text-sm">
                    {c.name}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate sm:text-base">
                    {c.type}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap sm:px-3 ${c.status === "Connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : c.status === "Pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                  >
                    {c.status}
                  </span>
                  <button
                    onClick={() => setDeleteConfirm(c.id)}
                    className="text-xs text-red-600 hover:underline whitespace-nowrap sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-3xl sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-xl sm:mb-3">
            Recent Activity
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Last sync
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                03:24 PM today
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Tables imported
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                12 tables
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900 sm:rounded-2xl sm:p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Schema check
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                All sources healthy
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="connections" className="mx-4 mt-6 sm:mx-0 sm:mt-8">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
          All connections
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {connections.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No connections yet. Add one to get started!
              </p>
            </div>
          ) : (
            connections.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:rounded-2xl sm:p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate sm:text-sm">
                    {c.type}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate sm:text-base">
                    {c.name}
                  </div>
                  {c.host && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {c.user ? `${c.user}@` : ""}
                      {c.host}
                      {c.port ? `:${c.port}` : ""}
                      {c.database ? ` / ${c.database}` : ""}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap sm:px-3 ${c.status === "Connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : c.status === "Pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                  >
                    {c.status}
                  </span>
                  <button
                    onClick={() => setDeleteConfirm(c.id)}
                    className="text-xs text-red-600 hover:underline whitespace-nowrap sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-900 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
              Remove connection?
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end sm:gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-4"
              >
                Cancel
              </button>
              <button
                onClick={() => removeConnection(deleteConfirm)}
                className="flex-1 rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800 sm:px-4"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4 sm:p-4">
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-4 shadow-lg dark:bg-gray-900 sm:rounded-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 sm:text-lg sm:mb-4">
              Add Data Source
            </h3>
            <div className="grid gap-3">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                Name *
              </label>
              <input
                value={form.name || ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="My Database"
                className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />

              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((s) => ({ ...s, type: e.target.value as DBType }))
                }
                className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {SUPPORTED_DBS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                Host (optional)
              </label>
              <input
                value={form.host || ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, host: e.target.value }))
                }
                placeholder="localhost"
                className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                    Port
                  </label>
                  <input
                    value={form.port || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, port: e.target.value }))
                    }
                    placeholder="5432"
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                    User
                  </label>
                  <input
                    value={form.user || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, user: e.target.value }))
                    }
                    placeholder="postgres"
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                Database name (optional)
              </label>
              <input
                value={form.database || ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, database: e.target.value }))
                }
                placeholder="my_database"
                className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />

              <div className="flex gap-2 justify-end pt-4 sm:gap-3 sm:pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-4 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={addConnection}
                  disabled={loading}
                  className="flex-1 rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:flex-none"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

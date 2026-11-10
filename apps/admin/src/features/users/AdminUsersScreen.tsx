import { useText } from '@senik/i18n';
import { AdminUsersSection1 } from './components/AdminUsersSection1';
import { useAdminUsers } from './hooks/useAdminUsers';

export function AdminUsersScreen() {
  const text = useText();
  const { query, users, filtered, filter, setFilter, search, setSearch } = useAdminUsers();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{text('User Management')}</h1>
      <label className="block text-slate-400 text-sm">
        {text('Search name or phone')}
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="block mt-2 w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {['all', 'customer', 'merchant_staff', 'rider', 'admin'].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setFilter(role)}
            aria-pressed={role === filter}
            className={`px-3 py-2 rounded-lg text-xs font-bold ${role === filter ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            {text(role)} (
            {role === 'all' ? users.length : users.filter((user) => user.role === role).length})
          </button>
        ))}
      </div>
      {query.isError && (
        <p role="alert" className="text-red-400">
          {text(query.error.message ?? '')}
        </p>
      )}
      <AdminUsersSection1 {...{ query, filtered }} />
      <p className="text-xs text-slate-400">
        {text('Showing {{count}} of {{total}} users', {
          count: filtered.length,
          total: users.length,
        })}
      </p>
    </div>
  );
}

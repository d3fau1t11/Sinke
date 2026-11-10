import { useText } from '@senik/i18n';
import type { useAdminUsers } from '../hooks/useAdminUsers';

type Props = {
  query: ReturnType<typeof useAdminUsers>['query'];
  filtered: ReturnType<typeof useAdminUsers>['filtered'];
};
export function AdminUsersSection1({ query, filtered }: Props) {
  const text = useText();
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="p-3">{text('User')}</th>
            <th className="p-3">{text('Phone')}</th>
            <th className="p-3">{text('Role')}</th>
            <th className="p-3">{text('Joined')}</th>
          </tr>
        </thead>
        <tbody>
          {query.isPending ? (
            <tr>
              <td colSpan={4} className="p-8 text-slate-400">
                {text('Loading users…')}
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-slate-400">
                {text('No users match your search.')}
              </td>
            </tr>
          ) : (
            filtered.map((user) => (
              <tr key={user.id} className="border-t border-slate-800 text-slate-300">
                <td className="p-3 font-semibold text-white">{user.full_name}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{text(user.role)}</td>
                <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi, getDemoRole } from '@senik/api';

export function useAdminUsers() {
  const query = useQuery({
    queryKey: ['admin-users', getDemoRole()],
    queryFn: usersApi.getAll,
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const users = query.data ?? [];
  const filtered = users.filter(
    (user) =>
      (filter === 'all' || user.role === filter) &&
      `${user.full_name} ${user.phone}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  return { query, users, filtered, filter, setFilter, search, setSearch };
}

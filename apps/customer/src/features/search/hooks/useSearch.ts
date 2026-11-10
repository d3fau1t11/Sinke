import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDemoRole } from '@senik/api';
import { searchCatalog } from '../services/searchCatalog';

export function useSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [tab, setTab] = useState('all');
  const [recent, setRecent] = useState<string[]>([]);
  const search = useQuery({
    queryKey: ['search', getDemoRole(), submitted],
    queryFn: () => searchCatalog(submitted), enabled: Boolean(submitted),
  });
  const submit = (value = query) => {
    const term = value.trim();
    setQuery(term); setSubmitted(term);
    if (term) setRecent((previous) => [term, ...previous.filter((item) => item !== term)].slice(0, 5));
  };
  const results = (search.data ?? []).filter((row) =>
    tab === 'all' || (tab === 'products' ? row.type === 'product' : row.type === 'merchant'),
  );
  return { query, setQuery, submitted, submit, tab, setTab, recent, clearRecent: () => setRecent([]),
    results, loading: search.isFetching, error: search.error, navigate };
}

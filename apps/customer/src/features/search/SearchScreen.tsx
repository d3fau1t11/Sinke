import { useText } from '@senik/i18n';
import { Button, Input, Skeleton } from '@senik/ui';
import { useSearch } from './hooks/useSearch';
import { SearchResultCard } from './components/SearchResultCard';

export function SearchScreen() {
  const text = useText();
  const model = useSearch();
  return <div className="p-4 space-y-5">
    <h1 className="font-bold text-xl">{text('Search')}</h1>
    <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); model.submit(); }}>
      <Input type="search" aria-label={text('Search')} placeholder={text('Search dishes and restaurants')}
        value={model.query} onChange={(event) => model.setQuery(event.target.value)} />
      <Button type="submit">{text('Search')}</Button>
    </form>
    <div className="flex gap-2">
      {['all', 'products', 'merchants'].map((tab) => <Button key={tab}
        variant={model.tab === tab ? 'primary' : 'secondary'} onClick={() => model.setTab(tab)}>
        {text(tab === 'all' ? 'All' : tab === 'products' ? 'Products' : 'Merchants')}
      </Button>)}
    </div>
    {!model.submitted && model.recent.length > 0 && <section>
      <h2 className="font-bold">{text('Recent Searches')}</h2>
      {model.recent.map((term) => <Button key={term} variant="ghost" onClick={() => model.submit(term)}>{term}</Button>)}
      <Button variant="ghost" onClick={model.clearRecent}>{text('Clear')}</Button>
    </section>}
    {model.loading ? <Skeleton variant="rectangular" height="160px" /> : model.results.map((result) =>
      <SearchResultCard key={result.id} result={result} onSelect={model.navigate} />)}
    {model.error && <p role="alert">{text('Could not load results. Try again.')}</p>}
    {model.submitted && !model.loading && !model.results.length && <p>{text('No results found')}</p>}
  </div>;
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Input, Skeleton, EmptyState, useSegmentedControl } from '@senik/ui';
import { productsApi } from '@senik/api/products';
import { businessesApi } from '@senik/api/businesses';
import type { SearchResult } from '@senik/types';

export function SearchScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { selectedValue: activeTab, setSelectedValue } = useSegmentedControl('all');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const tabs = [
    { id: 'all', labelAm: 'ሁሉም', labelEn: 'All' },
    { id: 'products', labelAm: 'ምግቦች', labelEn: 'Products' },
    { id: 'merchants', labelAm: 'ሱቆች', labelEn: 'Merchants' },
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [products, merchants] = await Promise.all([
        productsApi.search(searchQuery),
        businessesApi.search(searchQuery),
      ]);

      const combined: SearchResult[] = [
        ...products.map((p): SearchResult => ({ ...p, type: 'product' })),
        ...merchants.map((m): SearchResult => ({ ...m, type: 'merchant' })),
      ];

      setResults(combined);

      // Save to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== searchQuery.toLowerCase());
        return [searchQuery, ...filtered].slice(0, 5);
      });
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <div className="flex-1">
      <div className="px-4 py-4 space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            label={isAm ? 'ፈልግ' : 'Search'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAm ? 'ምግብ፣ ሸቀጥ፣ ሱቆችን ይፈልጉ...' : 'Search dishes, groceries, businesses...'}
            leftIcon={<span className="material-symbols-outlined text-primary">search</span>}
            rightIcon={query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
            fullWidth
          />
        </form>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedValue(tab.id)}
            >
              {isAm ? tab.labelAm : tab.labelEn}
            </Button>
          ))}
        </div>

        {recentSearches.length > 0 && !query && !loading && results.length === 0 && (
          <Card variant="outlined" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                {isAm ? 'የቅርብ ፈልጎች' : 'Recent Searches'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleClearRecent}>
                {isAm ? 'አጽዳ' : 'Clear'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRecentClick(search)}
                >
                  <span className="material-symbols-outlined mr-1">history</span>
                  {search}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {loading && (
          <div className="space-y-3 px-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" className="h-20" />)}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <EmptyState
            t={t}
            isAm={isAm}
            title={isAm ? 'ውጤት አልተገኘም' : 'No Results Found'}
            message={isAm ? 'የፈለግቱን ጥያቄ ይቀይሩ ወይም ሌላ ይፈልጉ' : 'Try a different search term or browse categories'}
            actionLabel={isAm ? 'ፈልግን አስቀርብ' : 'Clear Search'}
            onAction={() => setQuery('')}
          />
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-on-surface">
                {isAm ? 'ውጤቶች' : 'Results'} ({results.length})
              </h3>
            </div>

            {activeTab !== 'merchants' && (
              <div>
                <h4 className="font-medium text-on-surface-variant text-sm mb-2 px-2">
                  {isAm ? 'ምግቦች' : 'Products'}
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {results.filter((r) => r.type === 'product').slice(0, 10).map((prod) => (
                    <Card key={prod.id} variant="outlined" padding="none" className="w-40 flex-shrink-0" onClick={() => navigate(`/app/merchant/${prod.business_id}`)}>
                      <img
                        src={prod.image}
                        alt={isAm ? prod.name_am : prod.name_en}
                        className="w-full aspect-square object-cover rounded-t-xl"
                      />
                      <div className="p-2 space-y-1">
                        <h4 className="font-bold text-sm text-on-surface truncate">
                          {isAm ? prod.name_am : prod.name_en}
                        </h4>
                        <p className="text-xs text-primary font-bold">{prod.price} ETB</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'products' && (
              <div>
                <h4 className="font-medium text-on-surface-variant text-sm mb-2 px-2">
                  {isAm ? 'ሱቆች' : 'Merchants'}
                </h4>
                <div className="space-y-3">
                  {results.filter((r) => r.type === 'merchant').map((biz) => (
                    <Card key={biz.id} variant="outlined" padding="md" hoverable onClick={() => navigate(`/app/merchant/${biz.id}`)}>
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.avatar_image}
                          alt={isAm ? biz.name_am : biz.name_en}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface truncate">
                            {isAm ? biz.name_am : biz.name_en}
                          </h3>
                          <p className="text-sm text-on-surface-variant truncate">
                            {isAm ? biz.description_am : biz.description_en}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-primary">local_shipping</span>
                              {biz.delivery_eta}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-secondary">attach_money</span>
                              {biz.delivery_fee} ETB
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-primary">chevron_right</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
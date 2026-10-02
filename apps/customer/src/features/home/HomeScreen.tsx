import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useZoneStore } from '../zone/store/zoneStore';
import { Button, Card, Skeleton, EmptyState } from '@senik/ui';
import { businessesApi } from '@senik/api/businesses';
import { productsApi } from '@senik/api/products';
import type { BusinessListItem, ProductListItem } from '@senik/types';

export function HomeScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { selectedZoneId, selectedZoneName, selectedZoneNameAm } = useZoneStore();

  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [popularProducts, setPopularProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');

  const loadData = async () => {
    if (!selectedZoneId) return;

    try {
      setLoading(true);
      const [bizData, prodData] = await Promise.all([
        businessesApi.getByZone(selectedZoneId),
        productsApi.getPopular(),
      ]);
      setBusinesses(bizData);
      setPopularProducts(prodData);
    } catch (_err) {
      setError(isAm ? 'ውጤት ማግኘት አልተሳካም' : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZoneId]);

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-6">
        <Skeleton variant="text" lines={2} className="mx-4" />
        <Skeleton variant="rectangular" className="mx-4 h-40" />
        <div className="px-4 space-y-4">
          <Skeleton variant="text" lines={2} />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="w-40 flex-shrink-0 aspect-square" />)}
          </div>
        </div>
        <Skeleton variant="text" lines={2} className="px-4" />
        <div className="space-y-3 px-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="h-24" />)}
        </div>
      </div>
    );
  }

  if (!selectedZoneId) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ሰፈር የለመረጠም' : 'No Area Selected'}
          message={isAm ? 'እባክዎ የሚኖሩበትን ሰፈር ይምረጡ' : 'Please select your delivery area'}
          actionLabel={isAm ? 'ሰፈር ይምረጡ' : 'Select Area'}
          onAction={() => navigate('/location')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-4 space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">
              {isAm ? 'ወደ' : 'Delivering to'} <span className="font-bold text-on-surface">{isAm ? selectedZoneNameAm : selectedZoneName}</span>
            </p>
            <h1 className="font-display font-bold text-xl text-on-surface">
              {isAm ? 'ምን እናቅርብልዎ?' : 'What can we bring you?'}
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/location')}
            className="flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">edit_location</span>
            <span className="hidden sm:inline">{isAm ? 'ቀይር' : 'Change'}</span>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-on-surface">
            {isAm ? 'በቅርቡ ያሉ ሱቆች' : 'Nearby Businesses'}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/app/merchants')}>
            {isAm ? 'ሁሉንም አሳይ' : 'View All'}
          </Button>
        </div>

        {businesses.length === 0 ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={isAm ? 'ሱቆች አልተገኙም' : 'No Businesses Found'}
            message={isAm ? 'በዚህ ሰፈር ሱቆች አልተገኙም' : 'No businesses available in this area'}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {businesses.slice(0, 6).map((biz) => (
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
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-on-surface">
            {isAm ? 'ተወዳጅ ምግቦች' : 'Popular Dishes'}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/app/search')}>
            {isAm ? 'ሁሉንም አሳይ' : 'View All'}
          </Button>
        </div>

        {popularProducts.length === 0 ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={isAm ? 'ምግቦች አልተገኙም' : 'No Popular Items'}
            className="py-8"
          />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {popularProducts.slice(0, 10).map((prod) => (
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
                  <p className="text-xs text-primary font-bold">
                    {prod.price} ETB
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
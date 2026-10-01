import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Skeleton, EmptyState } from '@senik/ui';
import { useCartStore } from '../cart/store/cartStore';
import { useZoneStore } from '../zone/store/zoneStore';
import { businessesApi } from '@senik/api/businesses';
import { productsApi } from '@senik/api/products';

type Biz = Record<string, unknown> & { id: string };
type Prod = Record<string, unknown> & { id: string; category: string; name_am: string; name_en: string; price: number; image: string; is_fasting?: boolean; description_am?: string; description_en?: string };

export function MerchantDetailScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedZoneId } = useZoneStore();
  const { addItem, items } = useCartStore();

  const [business, setBusiness] = useState<Biz | null>(null);
  const [products, setProducts] = useState<Prod[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [bizData, prodData] = await Promise.all([
        businessesApi.getById(id!),
        productsApi.getByBusiness(id!),
      ]);
      setBusiness(bizData as unknown as Biz);
      setProducts(prodData as unknown as Prod[]);
    } catch (_err) {
      setError(isAm ? 'ውጤት ማግኘት አልተሳካም' : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product: Prod) => {
    if (!selectedZoneId) {
      navigate('/location');
      return;
    }

    const bizProducts = items.filter((i) => i.businessId === business.id);
    if (bizProducts.length > 0 && bizProducts[0].businessId !== business.id) {
      alert(isAm ? 'በአንድ ጊዜ ከአንድ ሱቅ መግዛት አይቻልም' : 'Cannot order from multiple businesses at once');
      return;
    }

    addItem({
      productId: product.id,
      businessId: business.id,
      name: isAm ? product.name_am : product.name_en,
      nameAm: product.name_am,
      price: product.price,
      quantity: 1,
      image: product.image,
      options: [],
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <Skeleton variant="text" lines={3} className="mx-4" />
        <Skeleton variant="rectangular" className="mx-4 h-48" />
        <Skeleton variant="text" lines={2} className="mx-4" />
        <div className="space-y-3 px-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="h-20" />)}
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ሱቅ አልተገኘም' : 'Business Not Found'}
          message={error}
        />
      </div>
    );
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex-1">
      <div className="relative h-48">
        <img
          src={business.cover_image}
          alt={isAm ? business.name_am : business.name_en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <img
              src={business.avatar_image}
              alt={isAm ? business.name_am : business.name_en}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white"
            />
            <div className="text-white">
              <h1 className="font-display font-bold text-xl">{isAm ? business.name_am : business.name_en}</h1>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                {business.delivery_eta} • {business.delivery_fee} ETB
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? (isAm ? 'ሁሉም' : 'All') : cat}
            </Button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={isAm ? 'ምግቦች አልተገኙም' : 'No Items Available'}
            message={isAm ? 'በዚህ ምድብ ምንም እቃ አልተገኘም' : 'No items found in this category'}
          />
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((prod) => (
              <Card key={prod.id} variant="outlined" padding="md" hoverable>
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={isAm ? prod.name_am : prod.name_en}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-on-surface truncate">
                      {isAm ? prod.name_am : prod.name_en}
                    </h3>
                    {prod.description_en && (
                      <p className="text-sm text-on-surface-variant truncate mt-1">
                        {isAm ? prod.description_am : prod.description_en}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-primary font-bold">{prod.price} ETB</span>
                      {prod.is_fasting && (
                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                          {isAm ? '🌿 የፆም' : '🌿 Fasting'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(prod)}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
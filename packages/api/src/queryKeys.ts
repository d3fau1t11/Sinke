export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
    profile: (userId: string) => ['auth', 'profile', userId] as const,
    addresses: (userId: string) => ['auth', 'addresses', userId] as const
  },
  zones: {
    all: () => ['zones'] as const,
    active: () => ['zones', 'active'] as const,
    byId: (id: string) => ['zones', id] as const
  },
  businesses: {
    all: (filters?: BusinessFilters) => ['businesses', filters] as const,
    byId: (id: string) => ['businesses', id] as const,
    byZone: (zoneId: string, filters?: BusinessFilters) => ['businesses', 'zone', zoneId, filters] as const,
    featured: () => ['businesses', 'featured'] as const,
    categories: () => ['businesses', 'categories'] as const
  },
  products: {
    all: (filters?: ProductFilters) => ['products', filters] as const,
    byId: (id: string) => ['products', id] as const,
    byBusiness: (businessId: string, filters?: ProductFilters) => ['products', 'business', businessId, filters] as const,
    popular: () => ['products', 'popular'] as const,
    search: (query: string) => ['products', 'search', query] as const
  },
  orders: {
    all: (filters?: OrderFilters) => ['orders', filters] as const,
    byId: (id: string) => ['orders', id] as const,
    active: () => ['orders', 'active'] as const,
    history: () => ['orders', 'history'] as const,
    tracking: (orderId: string) => ['orders', 'tracking', orderId] as const
  },
  payments: {
    methods: () => ['payments', 'methods'] as const,
    history: () => ['payments', 'history'] as const
  },
  promos: {
    all: () => ['promos'] as const,
    validate: (code: string) => ['promos', 'validate', code] as const
  },
  chat: {
    messages: (orderId: string) => ['chat', 'messages', orderId] as const,
    unreadCount: () => ['chat', 'unread'] as const
  },
  profiles: {
    rider: (riderId: string) => ['profiles', 'rider', riderId] as const,
    merchant: (businessId: string) => ['profiles', 'merchant', businessId] as const
  }
} as const;

export interface BusinessFilters {
  zoneId?: string;
  category?: string;
  dietaryFilter?: 'all' | 'fasting' | 'halal' | 'top';
  searchQuery?: string;
  isOpen?: boolean;
}

export interface ProductFilters {
  businessId?: string;
  category?: string;
  isFasting?: boolean;
  popular?: boolean;
  searchQuery?: string;
}

export interface OrderFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

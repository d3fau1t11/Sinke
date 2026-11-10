import type { Business, ProductWithOptions, ZoneListItem } from '@senik/types';
import { DEMO_BUSINESS_ID, DEMO_ZONE_ID } from './session';

const stamp = '2026-01-01T09:00:00.000Z';
const dishImage = (label: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" fill="${color}"/><circle cx="240" cy="138" r="84" fill="#fff6df"/><circle cx="240" cy="138" r="65" fill="#be7137"/><circle cx="219" cy="128" r="24" fill="#509344"/><circle cx="257" cy="151" r="28" fill="#e39b41"/><text x="240" y="270" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="26">${label}</text></svg>`)}`;

export const demoZones: ZoneListItem[] = [
  {
    id: DEMO_ZONE_ID,
    name_en: 'Koye Feche',
    name_am: 'ኮዬ ፈጬ',
    subcity_en: 'Akaki Kality',
    subcity_am: 'አቃቂ ቃሊቲ',
    delivery_fee: 40,
    delivery_eta: '20–30 min',
  },
  {
    id: 'demo-zone-tulu',
    name_en: 'Tulu Dimtu',
    name_am: 'ቱሉ ዲምቱ',
    subcity_en: 'Akaki Kality',
    subcity_am: 'አቃቂ ቃሊቲ',
    delivery_fee: 50,
    delivery_eta: '25–35 min',
  },
  {
    id: 'demo-zone-akaki',
    name_en: 'Akaki',
    name_am: 'አቃቂ',
    subcity_en: 'Akaki Kality',
    subcity_am: 'አቃቂ ቃሊቲ',
    delivery_fee: 35,
    delivery_eta: '15–25 min',
  },
];

function business(id: string, name: string, nameAm: string, zone: ZoneListItem): Business {
  return {
    id,
    name_en: name,
    name_am: nameAm,
    description_en: 'Fresh Ethiopian meals and neighborhood favorites',
    description_am: 'ትኩስ የኢትዮጵያ ምግቦች',
    category: 'restaurant',
    zone_id: zone.id,
    cover_image: dishImage(name, '#943b22'),
    avatar_image: dishImage(name, '#943b22'),
    rating: 4.8,
    reviews_count: 124,
    delivery_eta: zone.delivery_eta,
    delivery_fee: zone.delivery_fee,
    is_open: true,
    is_halal: true,
    is_fasting_friendly: true,
    featured: true,
    latitude: 8.879,
    longitude: 38.785,
    created_at: stamp,
    updated_at: stamp,
  };
}

export const demoBusinesses = [
  business(DEMO_BUSINESS_ID, 'Koye Kitchen', 'ኮዬ ኪችን', demoZones[0]!),
  business('demo-restaurant-tulu', 'Tulu Cafe', 'ቱሉ ካፌ', demoZones[1]!),
  business('demo-restaurant-akaki', 'Akaki Fresh', 'አቃቂ ፍሬሽ', demoZones[2]!),
];

function product(
  id: string,
  name: string,
  nameAm: string,
  price: number,
  businessId: string,
  fasting = false,
): ProductWithOptions {
  return {
    id,
    business_id: businessId,
    name_en: name,
    name_am: nameAm,
    description_en: 'Prepared fresh. Served with injera.',
    description_am: 'ትኩስ ምግብ ከእንጀራ ጋር',
    category: 'Meals',
    price,
    image: dishImage(name, fasting ? '#446735' : '#a44a2e'),
    is_fasting: fasting,
    is_available: true,
    popular: true,
    created_at: stamp,
    updated_at: stamp,
    product_options: [],
  };
}

export const demoProducts = [
  product('demo-doro', 'Doro Wot', 'ዶሮ ወጥ', 280, DEMO_BUSINESS_ID),
  product('demo-tibs', 'Special Tibs', 'ልዩ ጥብስ', 240, DEMO_BUSINESS_ID),
  product('demo-beyaynetu', 'Beyaynetu', 'በያይነቱ', 160, DEMO_BUSINESS_ID, true),
  product('demo-shiro', 'Shiro', 'ሽሮ', 120, DEMO_BUSINESS_ID, true),
  product('demo-tulu-meal', 'Tulu Breakfast', 'ቁርስ', 140, 'demo-restaurant-tulu'),
  product('demo-akaki-meal', 'Vegetable Platter', 'የአትክልት ምግብ', 150, 'demo-restaurant-akaki', true),
];

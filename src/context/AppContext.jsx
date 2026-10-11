import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { NEIGHBORHOODS, BUSINESSES, PRODUCTS, INITIAL_ORDERS, PROMOTIONS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('am'); // 'am' or 'en'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedLocation, setSelectedLocation] = useState('koye-feche');
  const [activeBusinessId, setActiveBusinessId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('motor'); // 'bajaj', 'motor', 'carry' — fastest preselected
  
  // Cart state
  const [cart, setCart] = useState([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedOptions: [{ nameAm: "ተጨማሪ እንጀራ", nameEn: "Extra Injera", price: 20 }],
      notes: "እባክዎን ሚጥሚጣ ለብቻው ይሁን"
    }
  ]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  // Orders & Live Tracking
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState('SNK-92841');
  const [trackingStageIndex, setTrackingStageIndex] = useState(4); // 0 to 5 (4 = On the way)
  const [isAutoTracking, setIsAutoTracking] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Translation helper
  const t = (key) => {
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'am' ? 'en' : 'am'));
  };

  const showToast = (message, icon = 'check_circle') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Cart operations
  const addToCart = (product, quantity = 1, selectedOptions = [], notes = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedOptions: selectedOptions.length ? selectedOptions : updated[existingIndex].selectedOptions,
          notes: notes || updated[existingIndex].notes
        };
        return updated;
      }
      return [...prev, { product, quantity, selectedOptions, notes }];
    });
    showToast(lang === 'am' ? `"${product.nameAm}" ወደ ቅርጫት ተጨምሯል` : `Added "${product.nameEn}" to cart`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(lang === 'am' ? 'እቃው ከቅርጫት ተነስቷል' : 'Item removed from cart', 'delete');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code) => {
    const promo = PROMOTIONS.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      showToast(lang === 'am' ? `የቅናሽ ኮድ "${promo.code}" ተተግብሯል!` : `Promo code "${promo.code}" applied!`);
      return true;
    }
    showToast(lang === 'am' ? 'የተሳሳተ የቅናሽ ኮድ' : 'Invalid promo code', 'error');
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Cart financial calculations
  const subtotal = cart.reduce((sum, item) => {
    const optionsPrice = (item.selectedOptions || []).reduce((optSum, opt) => optSum + (opt.price || 0), 0);
    return sum + (item.product.price + optionsPrice) * item.quantity;
  }, 0);

  const activeZoneObj = NEIGHBORHOODS.find((n) => n.id === selectedLocation) || NEIGHBORHOODS[0];
  const deliveryFee = cart.length > 0 ? activeZoneObj.deliveryFee : 0;
  const serviceFee = cart.length > 0 ? 15 : 0;
  
  const discountAmount = appliedPromo 
    ? (appliedPromo.discountPercent > 0 ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : deliveryFee)
    : 0;

  const totalAmount = Math.max(0, subtotal + deliveryFee + serviceFee - discountAmount);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order
  const placeOrder = (orderDetails) => {
    const firstBusiness = cart.length > 0 
      ? BUSINESSES.find((b) => b.id === cart[0].product.businessId) || BUSINESSES[0]
      : BUSINESSES[0];

    const newOrderNumber = `SNK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderNumber,
      businessId: firstBusiness.id,
      businessNameAm: firstBusiness.nameAm,
      businessNameEn: firstBusiness.nameEn,
      businessImage: firstBusiness.avatarImage,
      dateStr: lang === 'am' ? 'አሁን • Just Now' : 'Just Now',
      total: totalAmount,
      status: 'confirmed',
      etaMinutes: 25,
      items: cart.map((item) => ({
        nameAm: item.product.nameAm,
        nameEn: item.product.nameEn,
        quantity: item.quantity,
        price: item.product.price
      })),
      deliveryLocation: orderDetails?.address || `${activeZoneObj.fullNameEn}, Site 2`,
      paymentMethod: orderDetails?.paymentMethod || 'telebirr',
      rider: {
        name: "አበበ ከበደ (Abebe Kebede)",
        phone: "+251 91 245 8899",
        vehicle: "TVS King ባጃጅ • 3-38914 አ.አ",
        rating: "4.9 ★",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    setTrackingStageIndex(0); // Start at Confirmed
    clearCart();
    setAppliedPromo(null);
    setCurrentScreen('order-confirmation');
  };

  // Reorder flow
  const handleReorder = (order) => {
    // Find products matching order items or add defaults
    const itemsToAdd = order.items.map((item) => {
      const match = PRODUCTS.find((p) => p.nameAm === item.nameAm || p.nameEn === item.nameEn) || PRODUCTS[0];
      return {
        product: match,
        quantity: item.quantity || 1,
        selectedOptions: [],
        notes: ''
      };
    });
    setCart(itemsToAdd);
    setCurrentScreen('cart');
    showToast(lang === 'am' ? 'የትዕዛዙ እቃዎች ወደ ቅርጫት ተመልሰዋል' : 'Order items restored to cart');
  };

  // Auto progression for demo tracking
  useEffect(() => {
    let interval;
    if (isAutoTracking && currentScreen === 'order-tracking') {
      interval = setInterval(() => {
        setTrackingStageIndex((prev) => (prev < 5 ? prev + 1 : 5));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoTracking, currentScreen]);

  const activeTrackingOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  const navigateTo = (screen, payload = null) => {
    if (payload?.businessId) {
      setActiveBusinessId(payload.businessId);
    }
    if (payload?.product) {
      setActiveProduct(payload.product);
    }
    if (payload?.orderId) {
      setActiveTrackingOrderId(payload.orderId);
    }
    if (payload?.category) {
      setSelectedCategoryFilter(payload.category);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        currentScreen,
        setCurrentScreen,
        navigateTo,
        selectedLocation,
        setSelectedLocation,
        activeZoneObj,
        activeBusinessId,
        setActiveBusinessId,
        activeProduct,
        setActiveProduct,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        dietaryFilter,
        setDietaryFilter,
        searchQuery,
        setSearchQuery,
        deliveryMode,
        setDeliveryMode,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        serviceFee,
        discountAmount,
        totalAmount,
        cartItemsCount,
        orders,
        placeOrder,
        handleReorder,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        activeTrackingOrder,
        trackingStageIndex,
        setTrackingStageIndex,
        isAutoTracking,
        setIsAutoTracking,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

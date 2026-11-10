export { createClient, getClient, supabase } from './client';
export { queryKeys } from './queryKeys';
export * from './auth';
export * from './businesses';
export * from './products';
export * from './orders';
export * from './payments';
export {
  useOrderTracking,
  useSubscribeToOrderTracking,
  useUpdateRiderLocation,
  useNearbyRiders,
} from './tracking';
export * from './chat';
export * from './zones';
export * from './promos';
export * from './profiles';
export * from './addresses';
export * from './transactions';
export {
  demoAccounts,
  DEMO_BUSINESS_ID,
  DEMO_ZONE_ID,
  getDemoRole,
  getDemoProfile,
  startDemoSession,
  endDemoSession,
  isDemoSession,
} from './demo/session';
export type { DemoRole } from './demo/session';
export { resetDemoData } from './demo/store';
export { subscribeToOrder } from './orderSubscription';
export { usersApi } from './users';
export { useBusinessesInZone, usePopularProducts, useBusinessCatalog } from './catalogQueries';
export { useOrder, useCustomerOrders } from './orderQueries';
export { advanceDemoOrder } from './demo/orders';

export {
  registerDeviceToken,
  unregisterDeviceToken,
  getRegisteredDeviceToken,
  unregisterCurrentDeviceToken,
} from './deviceTokens';
export { getStaffIdentity, signInStaff, signOutStaff, hasBackendConfiguration } from './roleAuth';
export { useStaffSignIn } from './useStaffSignIn';
export type { StaffIdentity, StaffRole } from './roleAuth';
export { publishRiderLocation, setRiderAvailability } from './riderDevice';
export { useRiderCoordinate } from './riderTracking';
export { useStaffSession } from './useStaffSession';
export {
  sendCustomerOtp,
  verifyCustomerOtp,
  readCustomerProfile,
  normalizeEthiopianPhone,
} from './customerAuth';

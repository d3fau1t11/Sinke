import common from './common.json';
import shared from './shared.json';
import customer from './customer.json';
import merchant from './merchant.json';
import rider from './rider.json';
import admin from './admin.json';
export const en = common;
export const systemEn = { ...shared, ...customer, ...merchant, ...rider, ...admin };

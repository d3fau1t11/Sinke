import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerOrders } from '@senik/api';

export function useOrders() {
  const query = useCustomerOrders();
  const navigate = useNavigate();
  const [tab, setTab] = useState('active');
  const orders = (query.data ?? []).filter((order) =>
    ['delivered', 'cancelled'].includes(order.status) === (tab === 'past'),
  );
  return { query, orders, navigate, tab, setTab };
}

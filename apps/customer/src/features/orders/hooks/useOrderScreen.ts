import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrder, isDemoSession, advanceDemoOrder } from '@senik/api';
import { useApp } from '@senik/i18n';

export function useOrderScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const app = useApp();
  const client = useQueryClient();
  const query = useOrder(id);
  const advance = useMutation({
    mutationFn: async () => advanceDemoOrder(id!),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['order-detail'] });
    },
  });
  return { ...app, query, navigate, isDemo: isDemoSession(), advance };
}

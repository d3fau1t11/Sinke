import { Card } from '@senik/ui';
import { useLocalizedName, useText } from '@senik/i18n';
import { formatETB } from '@senik/utils';
import type { SearchResult } from '@senik/types';

type Props = { result: SearchResult; onSelect: (path: string) => void };
export function SearchResultCard({ result, onSelect }: Props) {
  const name = useLocalizedName();
  const text = useText();
  const isProduct = result.type === 'product';
  return <Card padding="md" hoverable onClick={() => onSelect(`/app/merchant/${
    isProduct ? result.business_id : result.id
  }`)} className="flex gap-3 items-center">
    <img src={isProduct ? result.image : result.avatar_image} alt={name(result)}
      className="w-16 h-16 object-cover rounded-xl" />
    <div>
      <h3 className="font-bold text-on-surface">{name(result)}</h3>
      <p>{isProduct ? formatETB(result.price) : text(result.is_open ? 'Open' : 'Closed')}</p>
    </div>
  </Card>;
}

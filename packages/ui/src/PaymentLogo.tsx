import telebirr from './assets/telebirr.png';
import cbe from './assets/cbe.png';
import cbeBirr from './assets/cbe-birr.svg';

export function PaymentLogo({ method }: { method: 'telebirr' | 'cbe' | 'cbe_birr' }) {
  const logo = method === 'telebirr' ? telebirr : method === 'cbe' ? cbe : cbeBirr;
  const label =
    method === 'telebirr'
      ? 'telebirr'
      : method === 'cbe'
        ? 'Commercial Bank of Ethiopia'
        : 'CBE Birr';
  return (
    <img src={logo} alt={label} className="h-10 w-20 object-contain bg-white rounded-md p-1" />
  );
}

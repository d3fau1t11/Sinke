import { useApp } from '@senik/i18n';

export function LanguageSwitcher() {
  const { lang, setLanguage } = useApp();
  return (
    <label className="inline-flex items-center gap-2 text-sm font-bold">
      <span>ቋንቋ / Language</span>
      <select
        aria-label="ቋንቋ / Language"
        value={lang}
        onChange={(event) => void setLanguage(event.target.value === 'am' ? 'am' : 'en')}
        className="rounded-lg border px-2 py-2 bg-white text-slate-900"
      >
        <option value="am">አማርኛ</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}

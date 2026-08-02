import type { Language } from '../../../config.ts';
import { t } from '../../../lang.ts';
import style from './LanguageToggle.module.css';

type LanguageToggleProps = {
  language: Language;
  onToggle: () => void;
};

export default function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  const label = t(language, language === 'fr' ? 'languageToggle.toEnglish' : 'languageToggle.toFrench');

  return (
    <button
      type="button"
      className={`${style.toggle} ${language === 'fr' ? style.fr : style.en}`}
      onClick={onToggle}
      aria-label={label}
      title={label}
    />
  );
}
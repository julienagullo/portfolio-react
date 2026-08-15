import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './LanguageButton.module.css';

export default function LanguageButton() {
  const { language, toggleLanguage, t } = useLanguage();
  const label = t('languageToggle');

  return (
    <button
      type="button"
      className={`${style.toggle} ${language === 'fr' ? style.fr : style.en}`}
      onClick={toggleLanguage}
      aria-label={label}
      title={label}
    />
  );
}

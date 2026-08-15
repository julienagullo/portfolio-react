import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './CloseButton.module.css';

type CloseButtonProps = {
  onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
  const { t } = useLanguage();
  const label = t('closeButton');

  return (
    <button
      type="button"
      className={style.toggle}
      onClick={onClick}
      aria-label={label}
      title={label}
    />
  );
}

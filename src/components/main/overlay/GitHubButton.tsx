import { GITHUB_REPOSITORY } from '../../../config.ts';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './GitHubButton.module.css';

export default function GitHubButton() {
  const { t } = useLanguage();
  const label = t('githubButton.label');

  return (
    <a
      className={style.toggle}
      href={GITHUB_REPOSITORY}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    />
  );
}

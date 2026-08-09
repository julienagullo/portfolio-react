import type { Language } from '../../../config.ts';
import { t } from '../../../lang.ts';
import style from './GitHubButton.module.css';

const GITHUB_PROFILE_URL = 'https://github.com/julienagullo';

type GitHubButtonProps = {
  language: Language;
};

export default function GitHubButton({ language }: GitHubButtonProps) {
  const label = t(language, 'githubButton.label');

  return (
    <a
      className={style.toggle}
      href={GITHUB_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    />
  );
}
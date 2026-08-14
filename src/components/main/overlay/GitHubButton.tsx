import {GITHUB_REPOSITORY, type Language} from '../../../config.ts';
import { t } from '../../../lang.ts';
import style from './GitHubButton.module.css';

type GitHubButtonProps = {
  language: Language;
};

export default function GitHubButton({ language }: GitHubButtonProps) {
  const label = t(language, 'githubButton.label');

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
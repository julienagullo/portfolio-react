import { useLanguage } from '../../../context/LanguageContext.tsx';
import { CONTACT_EMAIL, CV_PDF_URL, LEGAL_NOTICE, PROFILE_PHOTO_URL } from '../../../config/contact.ts';
import style from './ContactContent.module.css';

export default function ContactContent() {
  const { language, t } = useLanguage();

  return (
    <div className={style.wrapper}>
      <header className={style.header}>
        <div className={style.headerInfo}>
          <p className={style.role}>{t('contact.role')}</p>
          <address className={style.identity}>
            <b>{LEGAL_NOTICE.identity.name}</b>
            <br />
            {LEGAL_NOTICE.identity.street}
            <br />
            {LEGAL_NOTICE.identity.address}
            <br />
            {t('contact.siretLabel')} : {LEGAL_NOTICE.identity.siret}
            <br />
            {t('contact.phoneLabel')} : {LEGAL_NOTICE.identity.phone}
            <br />
            {t('contact.emailLabel')} : {CONTACT_EMAIL.user} <span className={style.at}>[at]</span> {CONTACT_EMAIL.domain}
          </address>
        </div>
        <img className={style.photo} src={PROFILE_PHOTO_URL} alt="" width={118} height={140} />
      </header>

      <a className={style.cvButton} href={CV_PDF_URL} target="_blank" rel="noreferrer">
        {t('contact.cvButton')}
      </a>

      <details className={style.accordionItem}>
        <summary className={style.accordionTrigger}>{t('contact.legalTitle')}</summary>
        <div className={style.accordionBody}>
          <p>
            {t('contact.legalOwnershipPrefix')} <strong>jagullo.fr</strong> {t('contact.legalOwnershipSuffix')}{' '}
            {LEGAL_NOTICE.identity.name} ({t('contact.legalOwnershipNote')}).
          </p>
          {LEGAL_NOTICE.paragraphs[language].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </details>
    </div>
  );
}

import Diorama from './babylon/Diorama.tsx';
import OrientationGate from './main/OrientationGate.tsx';
import UiOverlay from './main/overlay/UiOverlay.tsx';

import { LanguageProvider, useLanguage } from '../context/LanguageContext.tsx';
import { useTypewriterTitle } from '../hooks/useTypewriterTitle.ts';
import style from './Portfolio.module.css';

function PortfolioContent() {
    const { t } = useLanguage();

    useTypewriterTitle(t('siteTitle'));

    return (
        <main className={style.main}>
            <Diorama/>
            <OrientationGate/>
            <UiOverlay/>
        </main>
    );
}

export default function Portfolio() {
    return (
        <LanguageProvider>
            <PortfolioContent/>
        </LanguageProvider>
    );
}

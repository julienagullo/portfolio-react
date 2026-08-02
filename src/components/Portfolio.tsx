import { useState } from 'react';

import Diorama from './babylon/Diorama.tsx';
import OrientationGate from './main/OrientationGate.tsx';
import UiOverlay from './main/overlay/UiOverlay.tsx';

import { DEFAULT_LANGUAGE } from '../config.ts';
import { t } from '../lang.ts';
import { useTypewriterTitle } from '../hooks/useTypewriterTitle.ts';
import style from './Portfolio.module.css';

export default function Portfolio() {
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
    };

    useTypewriterTitle(t(language, 'siteTitle'));

    return (
        <main className={style.main}>
            <Diorama language={language}/>
            <OrientationGate language={language}/>
            <UiOverlay language={language} onToggleLanguage={toggleLanguage}/>
        </main>
    );
}
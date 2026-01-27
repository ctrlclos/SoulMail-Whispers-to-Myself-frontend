import { useState, useEffect  } from "react";

/**
 * Detects user's reading direction based on:
 * 1. HTML dir attribute
 * 2. CSS direction property
 * 3. browser language
 * 
 * Returns 'ltr' (left-to-right) or 'rtl' (right-to-left)
 */

const useReadingDirection = () => {
    const [direction, setDirection] = useState('ltr');

    useEffect(() => {
        const detectDirection = () => {

            const htmlDir = document.documentElement.dir;
            if(htmlDir === 'rtl' || htmlDir === 'ltr') {
                return htmlDir;
            }

            const cssDir = getComputedStyle(document.documentElement).direction;
            if (cssDir == 'rtl' || cssDir === 'ltr') {
                return cssDir;
            }
            const lang = navigator.language?.toLowerCase() || 'en';

            const rtlLanguages = [
                'ar',
                'he',
                'fa',
                'ur',
                'yi',
                'iw',
                'ps',
                'sd',
            ];

            const rtlBookLanguages = [
                'ja',
                'zh',
            ];

            if (rtlLanguages.some(l => lang.startsWith(l))) {
                return 'rtl';
            }

            if (rtlBookLanguages.some(l => lang.startsWith(l))) {
                return 'ltr';
            }
            return 'ltr';
            };
            
            setDirection(detectDirection());
    }, []);

    return direction;
};

export default useReadingDirection;

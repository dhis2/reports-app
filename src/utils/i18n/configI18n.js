import i18n from './locales';
import isLangRTL from './isLangRTL';

export const configI18n = (userSettings) => {
    const lang = userSettings.keyUiLocale;
    if (isLangRTL(lang)) {
        document.body.setAttribute('dir', 'rtl');
    }

    i18n.changeLanguage(lang);
};

export default configI18n;

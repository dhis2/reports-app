import i18n from './locales';
import { i18nKeys } from './i18n';

const isLangRTL = (code) => {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
};

export const configI18n = (userSettings) => {
    const lang = userSettings.keyUiLocale;
    if (isLangRTL(lang)) {
        document.body.setAttribute('dir', 'rtl');
    }

    i18n.changeLanguage(lang);
};

export const injectTranslationsToD2 = (d2) => {
    if (d2) {
        const translations = {};
        const translationKeys = Object.keys(i18nKeys.d2UiComponents);
        for (let i = 0; i < translationKeys.length; i++) {
            const key = translationKeys[i];
            translations[key] = i18n.t(i18nKeys.d2UiComponents[key]);
        }
        Object.assign(d2.i18n.translations, translations);
    }
};

export default configI18n;

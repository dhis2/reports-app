import i18n from './locales';
import { i18nKeys } from './i18nKeys';

const injectTranslationsToD2 = (d2) => {
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

export default injectTranslationsToD2;

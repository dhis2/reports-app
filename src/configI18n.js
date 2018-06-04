import i18n from './locales';

const isLangRTL = (code) => {
    const langs = ['ar', 'fa', 'ur'];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code.startsWith(c)).length > 0;
};

const configI18n = (userSettings) => {
    const lang = userSettings.keyUiLocale;
    if (isLangRTL(lang)) {
        document.body.setAttribute('dir', 'rtl');
    }

    i18n.changeLanguage(lang);
};

export default configI18n;

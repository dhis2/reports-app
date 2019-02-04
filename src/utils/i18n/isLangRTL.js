const langs = ['ar', 'fa', 'ur'];
const prefixed = langs.map(c => `${c}-`);

const isLangRTL = code => (
    langs.includes(code)
    || prefixed.filter(c => code.startsWith(c)).length > 0
);

export default isLangRTL;

export const isHtmlReport = (content) =>
    !!content && !!content.data && typeof content.data === 'string'

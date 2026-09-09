const defaultDisplayOptions = {
    beforeSectionText: '',
    pivotMode: 'n/a',
    afterSectionText: '',
    pivotCategory: null,
}
export const getDisplayOptions = (section) => {
    if (!section) {
        return defaultDisplayOptions
    }

    try {
        const { displayOptions: displayOptionString } = section
        return JSON.parse(displayOptionString ?? '{}')
    } catch (e) {
        console.error(
            `Failed to parse displayOptions for section ${section?.displayName}(${section?.id})`,
            e
        )
        return defaultDisplayOptions
    }
}

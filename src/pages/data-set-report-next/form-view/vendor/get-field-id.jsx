export const getFieldId = (dataElementId, categoryOptionComboId) => {
    return `${dataElementId}.${categoryOptionComboId}`
}

export const parseFieldId = (fieldId) => {
    if (!fieldId) {
        return {
            dataElementId: null,
            categoryOptionComboId: null,
        }
    }

    const [dataElementId, categoryOptionComboId] = fieldId.split('.')

    return {
        dataElementId,
        categoryOptionComboId,
    }
}

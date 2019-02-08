export const actionTypes = {
    SELECT_DATA_SET: 'SELECT_DATA_SET',
}

export const selectDataSet = dataSet => ({
    type: actionTypes.SELECT_DATA_SET,
    payload: dataSet,
})

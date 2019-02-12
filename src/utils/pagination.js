export const calculatePageValue = pager => {
    const pageSize = pager.pageSize
    const { total, pageCount, page } = pager
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize)
    const startItem = pageCalculationValue - pageSize + 1
    const endItem = pageCalculationValue

    return `${startItem} - ${endItem > total ? total : endItem}`
}

export default calculatePageValue

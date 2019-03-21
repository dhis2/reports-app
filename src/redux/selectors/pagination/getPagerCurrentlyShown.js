export default function getPagerCurrentlyShown(state) {
    const { pageSize, total, pageCount, page } = state.pagination
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize)
    const startItem = pageCalculationValue - pageSize + 1
    const endItem = pageCalculationValue

    return `${startItem} - ${endItem > total ? total : endItem}`
}

export default function getPagerCurrentlyShown(state) {
    const { pageSize, total, page } = state.pagination
    const projectedEnd = page * pageSize
    const start = projectedEnd - pageSize + 1
    const end = projectedEnd > total ? total : projectedEnd

    return `${start} - ${end}`
}

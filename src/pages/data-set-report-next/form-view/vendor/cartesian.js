// Computes the cartesian product of a matrix (array of array)
export const cartesian = (args) => {
    if (args.length === 0) {
        return []
    }

    const result = []
    const lim = args.length - 1

    function add(row, i) {
        const len = args[i].length
        for (let j = 0; j < len; j++) {
            const a = [...row]
            a.push(args[i][j])
            if (i === lim) {
                result.push(a)
            } else {
                add(a, i + 1)
            }
        }
    }
    add([], 0)
    return result
}
// [[1,2,3]. [1,2]] => [[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]

export function filterObject(object, filterFn) {
    return Object.fromEntries(Object.entries(object).filter(filterFn))
}

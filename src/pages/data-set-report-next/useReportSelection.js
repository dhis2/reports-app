import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/*
 * The form selection lives in the URL, so a report is linkable, survives a
 * refresh and works with the back button. The last selection is also kept in
 * local storage, because most people run the same report every month.
 *
 * The app uses hash history, so the search string sits inside the hash:
 *   #/data-set-report-next?ds=BfMAe6Itzgt&pe=202607&ou=/ImspTQPwCqd/O6uvpzGd5pu
 */
const STORAGE_KEY = 'reports-app:data-set-report-next:last'

export const emptySelection = {
    dsId: '',
    periodType: '',
    year: new Date().getFullYear(),
    pe: '',
    ouPath: '',
    selectedUnitOnly: false,
    filters: {},
}

const parseFilters = (value) => {
    if (!value) {
        return {}
    }

    return value.split(',').reduce((filters, pair) => {
        const [dimensionId, optionId] = pair.split(':')
        if (dimensionId && optionId) {
            filters[dimensionId] = optionId
        }
        return filters
    }, {})
}

const serialiseFilters = (filters) =>
    Object.entries(filters)
        .filter(([, optionId]) => Boolean(optionId))
        .map(([dimensionId, optionId]) => `${dimensionId}:${optionId}`)
        .join(',')

const fromSearch = (search) => {
    const params = new URLSearchParams(search)

    if (!params.get('ds')) {
        return null
    }

    return {
        dsId: params.get('ds') || '',
        periodType: params.get('pt') || '',
        year: Number(params.get('y')) || emptySelection.year,
        pe: params.get('pe') || '',
        ouPath: params.get('ou') || '',
        selectedUnitOnly: params.get('suo') === '1',
        filters: parseFilters(params.get('f')),
    }
}

const toSearch = (selection) => {
    const params = new URLSearchParams()

    if (selection.dsId) {
        params.set('ds', selection.dsId)
    }
    if (selection.periodType) {
        params.set('pt', selection.periodType)
    }
    if (selection.year) {
        params.set('y', String(selection.year))
    }
    if (selection.pe) {
        params.set('pe', selection.pe)
    }
    if (selection.ouPath) {
        params.set('ou', selection.ouPath)
    }
    if (selection.selectedUnitOnly) {
        params.set('suo', '1')
    }

    const filters = serialiseFilters(selection.filters)
    if (filters) {
        params.set('f', filters)
    }

    const search = params.toString()
    return search ? `?${search}` : ''
}

const readRemembered = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        // Private browsing, blocked storage, or a value we can no longer read.
        return null
    }
}

const writeRemembered = (value) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
        // Remembering is a convenience — never break the page over it.
    }
}

export const useReportSelection = () => {
    const history = useHistory()
    const location = useLocation()

    /*
     * Read once on mount. The URL wins over what we remembered, so a link
     * someone sent you always opens the report they meant.
     */
    const remembered = useMemo(readRemembered, [])
    const restoredFromMemory = useRef(false)
    const [selection, setSelection] = useState(() => {
        const fromUrl = fromSearch(location.search)

        if (fromUrl) {
            return fromUrl
        }

        if (remembered) {
            restoredFromMemory.current = true
            // The period is deliberately left out: it is recomputed to the
            // newest finished period once the data set is known.
            return {
                ...emptySelection,
                dsId: remembered.dsId || '',
                ouPath: remembered.ouPath || '',
                selectedUnitOnly: Boolean(remembered.selectedUnitOnly),
                filters: remembered.filters || {},
            }
        }

        return emptySelection
    })

    /* Keep the URL in step, without adding a history entry per keystroke. */
    const lastSearch = useRef(location.search)
    useEffect(() => {
        const search = toSearch(selection)

        if (search !== lastSearch.current) {
            lastSearch.current = search
            history.replace({ pathname: location.pathname, search })
        }
    }, [selection, history, location.pathname])

    const update = useCallback((changes) => {
        setSelection((current) => ({ ...current, ...changes }))
    }, [])

    const reset = useCallback(() => {
        setSelection(emptySelection)
    }, [])

    const remember = useCallback((value) => {
        writeRemembered({
            dsId: value.dsId,
            ouPath: value.ouPath,
            selectedUnitOnly: value.selectedUnitOnly,
            filters: value.filters,
        })
    }, [])

    return {
        selection,
        update,
        reset,
        remember,
        remembered,
        restoredFromMemory: restoredFromMemory.current,
    }
}

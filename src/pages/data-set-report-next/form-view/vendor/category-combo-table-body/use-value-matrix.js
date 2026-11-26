import { useMemo, useRef } from 'react'
import { useBlurredField, useValueStore } from '../../shared/index.js'
import { getFieldId } from '../get-field-id.jsx'

const createValueMatrix = (dataElements, sortedCOCs, dataValues) =>
    dataElements.map((de) =>
        sortedCOCs.map((coc) => dataValues?.[de?.id]?.[coc?.id]?.value)
    )

/**
 * Generates matrix (2d-array) of the values in a table, defined by dataElements and
 * the categoryOptionCombos.
 * @param {*} dataElements dataElements in order as rendered in table, these are "rows"
 * @param {*} sortedCOCs categoryOptionCombos in order as rendered in table, these are the "columns"
 */
export const useValueMatrix = (dataElements = [], sortedCOCs = []) => {
    const valueMatrixRef = useRef(null)
    const blurredField = useBlurredField()
    const dataValues = useValueStore((state) => state.getDataValues())

    const affectedFieldsLookup = useMemo(
        () =>
            new Set(
                dataElements.flatMap((de) =>
                    sortedCOCs.map((coc) => getFieldId(de.id, coc.id))
                )
            ),
        [dataElements, sortedCOCs]
    )

    return useMemo(() => {
        if (
            valueMatrixRef.current === null ||
            affectedFieldsLookup.has(blurredField)
        ) {
            valueMatrixRef.current = createValueMatrix(
                dataElements,
                sortedCOCs,
                dataValues
            )
        }
        return valueMatrixRef.current
    }, [
        blurredField,
        affectedFieldsLookup,
        dataElements,
        dataValues,
        sortedCOCs,
    ])
}

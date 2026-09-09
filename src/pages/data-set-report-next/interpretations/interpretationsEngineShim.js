/*
 * Teaching @dhis2/analytics' Interpretations components about data set reports.
 *
 * Those components are built for analytical objects, which are identified by a
 * single (type, id) pair. InterpretationsManager uses that pair twice:
 *
 *   list   GET  /interpretations?filter=${type}.id:eq:${id}
 *   create POST /interpretations/${type}/${id}          (no query params)
 *
 * A data set report is not one object. It is the triple (data set, period,
 * org unit), and the API says so:
 *
 *   create POST /interpretations/dataSetReport/{dataSet}?pe={iso}&ou={ou}
 *          — pe and ou are *required* (InterpretationController.java)
 *   stored with dataSet + period + organisationUnit, so the list filter field
 *          is `dataSet.id`; there is no `dataSetReport` property to filter on,
 *          and `type` is a derived getter in core, so it is not filterable.
 *
 * So neither call the manager makes can be right on its own. Rather than fork
 * the components (~3.6k lines) for a prototype, we let them ask for whatever
 * they like and rewrite the two requests on the way out, by handing them a
 * CustomDataProvider whose resource map is a Proxy: every resource resolves to
 * the handler below, which either rewrites the request or replays it verbatim
 * against the app's real data engine.
 *
 * The report's identity travels through the components as an opaque `id`
 * string — see encodeReportId — which never reaches the network.
 *
 * The real fix belongs upstream in analytics: the manager needs a type ->
 * filter-field map and the ability to attach params to the create mutation.
 * Then `type="dataSetReport"` would just work and this file would go away.
 */

const SEPARATOR = '~'

/** The (data set, period, org unit) triple, as the one string the components take. */
export const encodeReportId = ({ ds, pe, ou }) => [ds, pe, ou].join(SEPARATOR)

const decodeReportId = (value) => {
    const [ds, pe, ou] = String(value || '').split(SEPARATOR)
    return { ds, pe, ou }
}

const CREATE_PATTERN = /^interpretations\/dataSetReport\/(.+)$/

/*
 * Periods serialise as identifiable objects, so `id` is the period's uid —
 * which we do not have, only its ISO string. `code` is the one field core
 * always fills with the ISO date (Period.getCode()), with `name` as a fallback
 * for older versions.
 */
const periodIsoOf = (period) => period?.code || period?.name || period?.id

/*
 * Only the data set is filtered server-side. Narrowing by org unit would work
 * as a filter too, but period cannot be (see above), so the response has to be
 * walked anyway — and one filter that is certain to be accepted by every
 * server version is worth more here than a slightly smaller payload.
 */
const listInterpretations = async (engine, query) => {
    const requested = [].concat(query.params?.filter || [])[0] || ''
    const { ds, pe, ou } = decodeReportId(requested.split(':eq:')[1])
    const { result } = await engine.query({
        result: {
            resource: 'interpretations',
            params: {
                ...query.params,
                fields: [
                    ...[].concat(query.params?.fields || []),
                    'period[id,code,name]',
                    'organisationUnit[id]',
                ],
                filter: `dataSet.id:eq:${ds}`,
            },
        },
    })

    return {
        ...result,
        interpretations: (result.interpretations || []).filter(
            (interpretation) =>
                periodIsoOf(interpretation.period) === pe &&
                interpretation.organisationUnit?.id === ou
        ),
    }
}

const createInterpretation = (engine, reportId, query) => {
    const { ds, pe, ou } = decodeReportId(reportId)
    return engine.mutate({
        resource: `interpretations/dataSetReport/${ds}`,
        type: 'create',
        data: query.data,
        params: { pe, ou },
    })
}

/*
 * The link hands us the *fetch* type, which has already collapsed
 * update+partial into update/replace. Turn it back into a mutation the engine
 * will map the same way (getMutationFetchType), so the replay is identical to
 * the call the components made.
 */
const asMutation = (fetchType, query) => {
    if (fetchType === 'replace') {
        return { ...query, type: 'update', partial: false }
    }
    if (fetchType === 'update') {
        return { ...query, type: 'update', partial: true }
    }
    return { ...query, type: fetchType }
}

const replay = async (engine, fetchType, query) => {
    if (fetchType === 'read') {
        const { result } = await engine.query({ result: query })
        return result ?? null
    }
    return (await engine.mutate(asMutation(fetchType, query))) ?? null
}

/**
 * The `data` for a CustomDataProvider: a Proxy that answers for every resource
 * the Interpretations components can ask for, rewriting the two that are
 * wrong for data set reports and passing everything else — interpretation
 * details, comments, likes, the user search behind @mentions — through to the
 * real engine untouched.
 */
export const createInterpretationsData = (engine) =>
    new Proxy(
        {},
        {
            get: (_target, resource) => async (fetchType, query) => {
                /* The list. Details requests carry an id and are not rewritten. */
                if (
                    resource === 'interpretations' &&
                    fetchType === 'read' &&
                    !query.id
                ) {
                    return listInterpretations(engine, query)
                }

                const create = CREATE_PATTERN.exec(resource)
                if (create && fetchType === 'create') {
                    return createInterpretation(engine, create[1], query)
                }

                return replay(engine, fetchType, query)
            },
        }
    )

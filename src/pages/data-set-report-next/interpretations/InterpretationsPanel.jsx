import {
    InterpretationModal,
    InterpretationsProvider,
    InterpretationsUnit,
} from '@dhis2/analytics'
import {
    CustomDataProvider,
    useDataEngine,
    useDataQuery,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import {
    createInterpretationsData,
    encodeReportId,
} from './interpretationsEngineShim.js'
import styles from './InterpretationsPanel.module.css'

/*
 * Everything the analytics components read off the current user: the name
 * above the post box, the id behind "did I like this", the authorities that
 * decide whether the edit and delete actions appear, and the display property
 * the modal passes down to whatever renders the report.
 */
const CURRENT_USER_QUERY = {
    me: {
        resource: 'me',
        params: {
            fields: [
                'id',
                'displayName',
                'username',
                'authorities',
                'settings[keyAnalysisDisplayProperty]',
            ],
        },
    },
}

const Thread = ({ snapshot, reportPreview }) => {
    const [openInterpretationId, setOpenInterpretationId] = useState(null)
    const [replyFocus, setReplyFocus] = useState(false)

    const reportId = useMemo(
        () =>
            encodeReportId({
                ds: snapshot.ds,
                pe: snapshot.pe,
                ou: snapshot.ou,
            }),
        [snapshot.ds, snapshot.pe, snapshot.ou]
    )

    /*
     * The modal is built to show the visualisation an interpretation is about
     * beside the thread, and it renders it through a plugin component. Here
     * that "plugin" is the report already on screen, so the thread opens over
     * exactly what the person was reading.
     */
    const pluginComponent = useMemo(
        () =>
            function DataSetReportPreview() {
                return <div className={styles.preview}>{reportPreview}</div>
            },
        [reportPreview]
    )

    const modalSubject = useMemo(
        () => ({
            displayName: `${snapshot.dataSetName} — ${snapshot.periodName}, ${snapshot.orgUnitName}`,
        }),
        [snapshot.dataSetName, snapshot.periodName, snapshot.orgUnitName]
    )

    const openThread = (interpretationId, focusReply = false) => {
        setReplyFocus(focusReply)
        setOpenInterpretationId(interpretationId)
    }

    return (
        <>
            <div className={styles.body}>
                <InterpretationsUnit
                    type="dataSetReport"
                    id={reportId}
                    onInterpretationClick={(id) => openThread(id)}
                    onReplyIconClick={(id) => openThread(id, true)}
                />
            </div>

            {openInterpretationId && (
                <InterpretationModal
                    interpretationId={openInterpretationId}
                    isVisualizationLoading={false}
                    visualization={modalSubject}
                    pluginComponent={pluginComponent}
                    initialFocus={replyFocus}
                    onResponsesReceived={Function.prototype}
                    onClose={() => setOpenInterpretationId(null)}
                />
            )}
        </>
    )
}

Thread.propTypes = {
    snapshot: PropTypes.object.isRequired,
    reportPreview: PropTypes.node,
}

/**
 * The interpretations sidebar for the report currently on screen.
 *
 * Same shape as the data visualizer's details panel — a 380px column beside
 * the report holding the real @dhis2/analytics InterpretationsUnit — with the
 * data layer between it and the server rewritten for data set reports; see
 * interpretationsEngineShim.js for why that is needed.
 *
 * No chrome of its own: the unit brings its own "Interpretations" heading, and
 * the top bar's toggle is what opens and closes the column — again as the data
 * visualizer does it. What the interpretations are about is the report beside
 * them, which names itself on its own summary strip.
 */
export const InterpretationsPanel = ({ snapshot, reportPreview }) => {
    const engine = useDataEngine()
    const { data, loading, error } = useDataQuery(CURRENT_USER_QUERY)

    /* One Proxy per engine, so the components' context is not rebuilt on every render. */
    const interpretationsData = useMemo(
        () => createInterpretationsData(engine),
        [engine]
    )

    const currentUser = useMemo(() => {
        if (!data?.me) {
            return null
        }
        const { displayName, settings, ...rest } = data.me
        return {
            ...rest,
            name: displayName,
            displayName,
            settings,
        }
    }, [data])

    return (
        <aside className={styles.panel} aria-label={i18n.t('Interpretations')}>
            {loading && (
                <div className={styles.loading}>
                    <CircularLoader small />
                </div>
            )}

            {error && (
                <div className={styles.notice}>
                    <NoticeBox error title={i18n.t('Could not load')}>
                        {i18n.t(
                            'Interpretations need your user account, which could not be loaded.'
                        )}
                    </NoticeBox>
                </div>
            )}

            {currentUser && (
                <CustomDataProvider data={interpretationsData}>
                    <InterpretationsProvider currentUser={currentUser}>
                        <Thread
                            snapshot={snapshot}
                            reportPreview={reportPreview}
                        />
                    </InterpretationsProvider>
                </CustomDataProvider>
            )}
        </aside>
    )
}

InterpretationsPanel.propTypes = {
    /** The report on screen: ds / pe / ou, plus the names the modal titles itself with. */
    snapshot: PropTypes.object.isRequired,
    /** Rendered beside the thread when an interpretation is opened. */
    reportPreview: PropTypes.node,
}

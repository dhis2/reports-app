import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './StandardReportNext.module.css'

/*
 * Stand-ins for the two management dialogs.
 *
 * Both are deliberately inert. The real versions are the existing
 * redux-connected AddEditStdReport form and the d2-ui SharingDialog, and
 * wiring either into this page means dragging that stack along — a decision
 * for when the prototype has earned it, not a thing to do in passing.
 *
 * What they do show is real: the report's own values, read from the API.
 * A mock that invents its content teaches you nothing about whether the
 * dialog is in the right place, and a fake sharing screen that looks like it
 * changed permissions is worse than no screen at all. So they read, and say
 * plainly that they do not write.
 */

const NotYet = ({ children }) => (
    <div className={styles.dialogNotice}>
        <NoticeBox title={i18n.t('Not built yet')}>{children}</NoticeBox>
    </div>
)

NotYet.propTypes = { children: PropTypes.node }

const Field = ({ label, children }) => (
    <div className={styles.dialogField}>
        <span className={styles.dialogLabel}>{label}</span>
        <span className={styles.dialogValue}>{children}</span>
    </div>
)

Field.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
}

export const NewReportDialog = ({ onClose }) => (
    <Modal onClose={onClose} position="middle">
        <ModalTitle>{i18n.t('New standard report')}</ModalTitle>
        <ModalContent>
            <NotYet>
                {i18n.t(
                    'This will become the report creation form. Nothing is saved yet.'
                )}
            </NotYet>

            <p className={styles.dialogLede}>
                {i18n.t('Creating a report will ask for:')}
            </p>

            <Field label={i18n.t('Name')}>
                {i18n.t('What people will see in the list')}
            </Field>
            <Field label={i18n.t('Design file')}>
                {i18n.t('The HTML your team wrote, uploaded here')}
            </Field>
            <Field label={i18n.t('Asks for')}>
                {i18n.t(
                    'Whether running it should ask for a period, an organisation unit, both or neither'
                )}
            </Field>
            <Field label={i18n.t('Periods allowed')}>
                {i18n.t('Which periods it may be run for')}
            </Field>
            <Field label={i18n.t('Cache strategy')}>
                {i18n.t('How long a generated report may be reused')}
            </Field>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onClose}>{i18n.t('Close')}</Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

NewReportDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export const EditReportDialog = ({ report, onClose }) => (
    <Modal onClose={onClose} position="middle">
        <ModalTitle>{i18n.t('Edit report')}</ModalTitle>
        <ModalContent>
            <NotYet>
                {i18n.t(
                    'This will become the report editor: name, design file, cache strategy, which parameters the report asks for and which periods it allows. Nothing here can be changed yet.'
                )}
            </NotYet>

            <Field label={i18n.t('Name')}>{report.displayName}</Field>
            <Field label={i18n.t('Identifier')}>
                <code>{report.id}</code>
            </Field>
            <Field label={i18n.t('Asks for')}>
                {[
                    report.reportParams?.reportingPeriod && i18n.t('Period'),
                    report.reportParams?.organisationUnit &&
                        i18n.t('Organisation unit'),
                ]
                    .filter(Boolean)
                    .join(', ') || i18n.t('Nothing')}
            </Field>
            <Field label={i18n.t('Periods allowed')}>
                {Object.entries(report.relativePeriods || {})
                    .filter(([, allowed]) => allowed)
                    .map(([key]) => key)
                    .join(', ') || i18n.t('All')}
            </Field>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onClose}>{i18n.t('Close')}</Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

EditReportDialog.propTypes = {
    report: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

/*
 * DHIS2 sharing strings are eight characters, of which only the first two —
 * metadata read and write — mean anything for a report.
 */
const publicAccessLabel = (access = '') => {
    if (access.startsWith('rw')) {
        return i18n.t('Everyone can view and edit')
    }
    if (access.startsWith('r-')) {
        return i18n.t('Everyone can view')
    }
    return i18n.t('No public access')
}

export const SharingDialog = ({ report, onClose }) => {
    const sharing = report.sharing || {}
    const users = Object.keys(sharing.users || {}).length
    const groups = Object.keys(sharing.userGroups || {}).length

    return (
        <Modal onClose={onClose} position="middle">
            <ModalTitle>{i18n.t('Sharing settings')}</ModalTitle>
            <ModalContent>
                <NotYet>
                    {i18n.t(
                        'This will become the sharing editor. The settings below are the real ones for this report, shown read-only — nothing here changes them.'
                    )}
                </NotYet>

                <Field label={i18n.t('Public access')}>
                    <Tag>{publicAccessLabel(sharing.public)}</Tag>
                </Field>
                <Field label={i18n.t('Shared with')}>
                    {users || groups
                        ? [
                              users &&
                                  i18n.t('{{count}} user', {
                                      count: users,
                                      defaultValue_plural: '{{count}} users',
                                  }),
                              groups &&
                                  i18n.t('{{count}} group', {
                                      count: groups,
                                      defaultValue_plural: '{{count}} groups',
                                  }),
                          ]
                              .filter(Boolean)
                              .join(', ')
                        : i18n.t('Nobody in particular')}
                </Field>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose}>{i18n.t('Close')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

SharingDialog.propTypes = {
    report: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

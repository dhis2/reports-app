import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import OrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree'
import GroupSets from '../../components/GroupSetsDropdown'
import { formLabel, actionsContainer } from '../../utils/styles/shared.js'

export const Form = props => (
    <div id="org-unit-dist-report-form">
        <div className="row">
            <div className="col-xs-12 col-md-6">
                <div className={formLabel.className}>
                    {i18n.t('Report organisation unit')}
                </div>
                <OrganisationUnitsTree />
            </div>
            <div className="col-xs-12 col-md-6">
                <div id="group-sets-selection">
                    <GroupSets />
                </div>
            </div>
        </div>
        <div id="actions" className={actionsContainer.className}>
            <Button
                raised
                color="primary"
                onClick={props.onGetReportClick}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Report')}
            </Button>
            <Button
                raised
                color="accent"
                onClick={props.onGetChartClick}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Chart')}
            </Button>
        </div>
        {formLabel.styles}
        {actionsContainer.styles}
        <style jsx>{`
            div #actions :global(.d2-ui-button):first-child {
                margin-right: 16px;
            }
        `}</style>
    </div>
)

Form.propTypes = {
    isActionEnabled: PropTypes.bool.isRequired,
    onGetReportClick: PropTypes.func.isRequired,
    onGetChartClick: PropTypes.func.isRequired,
}

import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import OrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree.jsx'
import GroupSets from '../../components/GroupSetsDropdown.jsx'
import { formLabel, actionsContainer } from '../../utils/styles/shared.jsx'

export const Form = (props) => (
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
        <div id="actions" className={`${actionsContainer.className}`}>
            <button
                type="button"
                id="main-action-button"
                onClick={props.onGetReportClick}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Report')}
            </button>

            <button
                type="button"
                id="secondary-action-button"
                onClick={props.onGetChartClick}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Chart')}
            </button>
        </div>
        {formLabel.styles}
        {actionsContainer.styles}
    </div>
)

Form.propTypes = {
    isActionEnabled: PropTypes.bool.isRequired,
    onGetChartClick: PropTypes.func.isRequired,
    onGetReportClick: PropTypes.func.isRequired,
}

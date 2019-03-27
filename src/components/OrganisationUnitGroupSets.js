/* React */
/* i18n */
import i18n from '@dhis2/d2-i18n'
/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
/* App context */
import AppContext from '../pages/AppContext'
import { formLabel } from '../utils/shared-styles'

export class OrganisationUnitGroupSets extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
        fullWidth: PropTypes.bool,
    }

    static defaultProps = {
        fullWidth: true,
    }

    constructor() {
        super()

        this.state = {
            organisationUnitGroupSets: [],
        }
    }

    componentDidMount() {
        const d2 = this.props.d2
        d2.models.organisationUnitGroupSet
            .list({
                paging: false,
                fields: 'id,displayName,organisationUnitGroups[id,displayName]',
            })
            .then(organisationUnitGroupSetsResponse => {
                this.setState({
                    organisationUnitGroupSets: organisationUnitGroupSetsResponse.toArray(),
                })
            })
            .catch(() => {
                // TODO Manage error
            })
    }

    handleOrganisationUnitGroupSetChange = organisationUnitGroupSetId => element => {
        this.props.onChange(organisationUnitGroupSetId, element)
    }

    renderOrganisationUnitGroupSetDropdown = organisationUnitGroupSet => (
        <div key={organisationUnitGroupSet.id}>
            <span className={formLabel.className}>
                {organisationUnitGroupSet.displayName}
            </span>
            <DropDown
                fullWidth={this.props.fullWidth}
                value={this.props.values[organisationUnitGroupSet.id]}
                onChange={this.handleOrganisationUnitGroupSetChange(
                    organisationUnitGroupSet.id
                )}
                menuItems={organisationUnitGroupSet.organisationUnitGroups}
                includeEmpty
                emptyLabel={i18n.t('Select Option')}
                hintText={i18n.t('Select Option')}
            />
            <style>{formLabel.styles}</style>
        </div>
    )

    render = () =>
        this.state.organisationUnitGroupSets.map(organisationUnitGroupSet =>
            this.renderOrganisationUnitGroupSetDropdown(
                organisationUnitGroupSet
            )
        )
}

export default props => (
    <AppContext.Consumer>
        {appContext => (
            <OrganisationUnitGroupSets d2={appContext.d2} {...props} />
        )}
    </AppContext.Consumer>
)

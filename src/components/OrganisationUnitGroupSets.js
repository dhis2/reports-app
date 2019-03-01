/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'

/* App context */
import AppContext from '../pages/AppContext'

/* i18n */
import i18n from '@dhis2/d2-i18n'

/* styles */
import styles from '../utils/styles'

export class OrganisationUnitGroupSets extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
        dropdownStyle: PropTypes.object,
        fullWidth: PropTypes.bool,
    }

    static defaultProps = {
        fullWidth: true,
        dropdownStyle: {
            display: 'block',
        },
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
            <span style={styles.formLabel}>
                {organisationUnitGroupSet.displayName}
            </span>
            <DropDown
                style={this.props.dropdownStyle}
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

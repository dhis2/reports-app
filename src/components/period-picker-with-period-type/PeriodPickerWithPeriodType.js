/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'

/* d2-ui components */
import { DropDown, PeriodPicker } from '@dhis2/d2-ui-core'

/* App context */
import AppContext from '../../pages/AppContext'

/* Actions */
import loadPeriodTypes from '../../redux/actions/periodTypes'
import pluckPeriodTypes from '../../redux/selectors/periodTypes'

/* i18n */

/* styles */
import styles from '../../utils/styles'

export class PeriodPickerWithPeriodType extends PureComponent {
    state = {
        periodTypes: [],
        selectedPeriodType: null,
        selected: null,
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    getChildContext() {
        return {
            d2: this.props.d2,
        }
    }

    componentDidMount() {
        const { loadPeriodTypes, periodTypes } = this.props
        if (Array.isArray(periodTypes) && periodTypes.length === 0) {
            loadPeriodTypes()
        }
    }

    onChangePeriodType = event => {
        const selectedPeriodType = event.target.value
        this.setState({
            selectedPeriodType,
        })
    }

    renderPeriodTypeDropdown = () => {
        const msg = i18n.t('Select Period Type')
        return (
            <DropDown
                value={this.state.selectedPeriodType}
                onChange={this.onChangePeriodType}
                menuItems={this.props.periodTypes}
                fullWidth
                emptyLabel={msg}
                hintText={msg}
            />
        )
    }

    render() {
        const { periodTypes } = this.props
        const error =
            periodTypes instanceof Error ? periodTypes.toString() : null

        return (
            <div>
                <span style={{ ...styles.formLabel, display: 'block' }}>
                    {this.props.label}
                </span>
                {error && <span style={styles.error}>{error}</span>}
                {!error && this.renderPeriodTypeDropdown()}
                {this.state.selectedPeriodType && (
                    <PeriodPicker
                        periodType={this.state.selectedPeriodType}
                        onPickPeriod={this.props.onChange}
                    />
                )}
            </div>
        )
    }
}

PeriodPickerWithPeriodType.propTypes = {
    d2: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string,
    loadPeriodTypes: PropTypes.func.isRequired,
    periodTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
        .isRequired,
}

PeriodPickerWithPeriodType.defaultProps = {
    onChange: () => {},
    label: i18n.t('Period'),
}

/* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
PeriodPickerWithPeriodType.childContextTypes = {
    d2: PropTypes.object.isRequired,
}

const PeriodPickerWithPeriodTypeWithContext = props => (
    <AppContext.Consumer>
        {appContext => (
            <PeriodPickerWithPeriodType d2={appContext.d2} {...props} />
        )}
    </AppContext.Consumer>
)

const mapStateToProps = ({ periodTypes }) => ({
    periodTypes: pluckPeriodTypes(periodTypes),
})

export default connect(
    mapStateToProps,
    {
        loadPeriodTypes,
    }
)(PeriodPickerWithPeriodTypeWithContext)

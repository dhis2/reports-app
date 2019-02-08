import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import AppContext from '../pages/AppContext'
import i18n from '../utils/i18n/locales'
import styles from '../utils/styles'
import { selectDataSet, loadDataSetOptions } from '../redux/actions/dataSet'

export class DatasetsDropdown extends PureComponent {
    static propTypes = {
        selected: PropTypes.object.isRequired,
        options: PropTypes.array.isRequired,
        selectDataSet: PropTypes.func.isRequired,
        loadDataSetOptions: PropTypes.func.isRequired,

        onChange: PropTypes.func,
        label: PropTypes.string,
        fullWidth: PropTypes.bool,
        filter: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => {},
        label: i18n.t('Data set'),
        fullWidth: true,
        filter: null,
    }

    componentDidMount() {
        this.props.loadDataSetOptions(this.props.filter)
    }

    render() {
        const { props } = this

        return (
            <AppContext.Consumer>
                {appContext => (
                    <div>
                        <span style={styles.formLabel}>{props.label}</span>
                        <DropDown
                            includeEmpty
                            d2={appContext.d2}
                            fullWidth={props.fullWidth}
                            value={props.selected.id}
                            onChange={
                                props.onChange
                                    ? props.onChange
                                    : props.selectDataSet
                            }
                            menuItems={props.options}
                            emptyLabel={i18n.t('Select Data Set')}
                            hintText={i18n.t('Select Data Set')}
                        />
                    </div>
                )}
            </AppContext.Consumer>
        )
    }
}

const mapStateToProps = state => ({
    selected: state.dataSet.selected,
    options: state.dataSet.options,
})

const mapDispatchToProps = dispatch => ({
    selectDataSet: event => dispatch(selectDataSet(event.target.value)),
    loadDataSetOptions: () => dispatch(loadDataSetOptions()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetsDropdown)

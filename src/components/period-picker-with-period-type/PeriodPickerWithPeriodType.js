/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { DropDown, PeriodPicker } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export class PeriodPickerWithPeriodType extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => {},
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    static childContextTypes = {
        d2: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            periodTypes: [],
            selectedPeriodType: null,
            selected: null,
        };
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    componentDidMount() {
        const api = this.props.d2.Api.getApi();
        api.get('periodTypes').then((periodTypesResponse) => {
            this.setState({
                periodTypes: periodTypesResponse.periodTypes.map(periodType => ({
                    id: periodType.name,
                    displayName: periodType.name,
                })),
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    onChangePeriodType = (event) => {
        const selectedPeriodType = event.target.value;
        this.setState({
            selectedPeriodType,
        });
    }

    renderPeriodTypeDropdown = () => (
        <DropDown
            value={this.state.selectedPeriodType}
            onChange={this.onChangePeriodType}
            menuItems={this.state.periodTypes}
            includeEmpty
            emptyLabel={i18n.t(i18nKeys.periodPicker.periodTypeHintText)}
            hintText={i18n.t(i18nKeys.periodPicker.periodTypeHintText)}
        />
    )

    render() {
        return (
            <div>
                { this.renderPeriodTypeDropdown() }
                { this.state.selectedPeriodType &&
                    <PeriodPicker
                        periodType={this.state.selectedPeriodType}
                        onPickPeriod={this.props.onChange}
                    />
                }
            </div>
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <PeriodPickerWithPeriodType
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);

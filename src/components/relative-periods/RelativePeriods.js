/* React */
import React from 'react';

/* d2-ui */
import { CheckBox } from '@dhis2/d2-ui-core';

import relativePeriods from './relative.periods.conf';

class RelativePeriods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relativePeriods: {
                thisDay: false,
                yesterday: false,
                last3Days: false,
                last7Days: false,
                last14Days: false,
                thisWeek: false,
                lastWeek: false,
                last4Weeks: false,
                last12Weeks: false,
                last52Weeks: false,
                weeksThisYear: false,
                thisMonth: false,
                lastMonth: false,
                last3Months: false,
                last6Months: false,
                last12Months: false,
                monthsThisYear: false,
                thisBimonth: false,
                lastBimonth: false,
                last6BiMonths: false,
                biMonthsThisYear: false,
                thisQuarter: false,
                lastQuarter: false,
                last4Quarters: false,
                quartersThisYear: false,
            },
        };
    }

    onChangeCheck = (event) => {
        console.log(this.state.relativePeriods[event.target.id]);
        this.state.relativePeriods[event.target.id] = !this.state.relativePeriods[event.target.id];
        console.log(this.state.relativePeriods[event.target.id]);
        // this.setState({ ...this.state.relativePeriods, relativePeriods[event.target.id]: !this.state.relativePeriods[event.target.id] });
    };

    render() {
        const dummy = relativePeriods.map(relativePeriod => (
            <div key={relativePeriod.label} className="col-xs-12 col-sm-6 col-md-4">
                <h4>{relativePeriod.label}</h4>
                {
                    relativePeriod.periods.map(period => (
                        <CheckBox
                            id={period.id}
                            key={period.id}
                            label={period.name}
                            onChange={this.onChangeCheck}
                        />
                    ))
                }
            </div>
        ));
        return (
            <div className="row" style={{ width: '100%', paddingLeft: 5 }}>
                {dummy}
            </div>
        );
    }
}

export default RelativePeriods;

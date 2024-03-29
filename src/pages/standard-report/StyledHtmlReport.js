import i18n from '@dhis2/d2-i18n'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { resolve } from 'styled-jsx/css'
import {
    sections,
    STANDARD_REPORT_SECTION_KEY,
} from '../../config/sections.config.js'
import { generateHtmlReport } from '../../redux/actions/standardReport.js'
import HtmlReport from './HtmlReport.js'

const reportCard = resolve`
     {
        margin-top: 16px;
        padding: 16px;
        flex-grow: 1;
        position: relative;
        display: flex;
        flex-direction: column;
    }
`

const LinkToListWithRef = React.forwardRef((props, ref) => (
    <Link
        innerRef={ref}
        to={sections[STANDARD_REPORT_SECTION_KEY].path}
        {...props}
    />
))

LinkToListWithRef.displayName = 'LinkToListWithRef'

class StyledHtmlReport extends React.Component {
    componentDidMount() {
        const {
            match: {
                params: { id },
            },
            location: { search },
            generateHtmlReport,
        } = this.props
        const searchParams = new URLSearchParams(search)
        const orgUnitId = searchParams.get('ou')
        const reportPeriod = searchParams.get('pe')

        generateHtmlReport({ id, orgUnitId, reportPeriod })
    }
    render() {
        return (
            <div className="container">
                <div className="button-row">
                    <Button
                        variant="contained"
                        color="primary"
                        component={LinkToListWithRef}
                    >
                        {i18n.t('Back to standard reports list')}
                    </Button>
                </div>
                <Card className={reportCard.className}>
                    <HtmlReport html={this.props.reportData} />
                </Card>
                <style jsx>{`
                    .container {
                        min-height: calc(100vh - 84px);
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
                {reportCard.styles}
            </div>
        )
    }
}

StyledHtmlReport.propTypes = {
    generateHtmlReport: PropTypes.func.isRequired,
    reportData: PropTypes.string.isRequired,
    location: PropTypes.shape({ search: PropTypes.string }),
    match: PropTypes.shape({
        params: PropTypes.shape({ id: PropTypes.string }),
    }),
}

export default connect(
    ({ reportData }) => ({
        reportData:
            typeof reportData.content === 'string' ? reportData.content : '',
    }),
    {
        generateHtmlReport,
    }
)(StyledHtmlReport)

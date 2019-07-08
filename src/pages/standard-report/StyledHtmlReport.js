import i18n from '@dhis2/d2-i18n'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { resolve } from 'styled-jsx/css'
import {
    sections,
    STANDARD_REPORT_SECTION_KEY,
} from '../../config/sections.config'
import { generateHtmlReport } from '../../redux/actions/standardReport'
import HtmlReport from './HtmlReport'

const reportCard = resolve`
     {
        margin-top: 16px;
        padding: 16px;
    }
`

const LinkToListWithRef = React.forwardRef((props, ref) => (
    <Link
        innerRef={ref}
        to={sections[STANDARD_REPORT_SECTION_KEY].path}
        {...props}
    />
))

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
        const reportPeriod = searchParams.get('p')

        generateHtmlReport({ id, orgUnitId, reportPeriod })
    }
    render() {
        return (
            <Fragment>
                <Button
                    variant="contained"
                    color="primary"
                    component={LinkToListWithRef}
                >
                    {i18n.t('Back to standard reports list')}
                </Button>
                <Card className={reportCard.className}>
                    <HtmlReport html={this.props.reportData} />
                </Card>
                {reportCard.styles}
            </Fragment>
        )
    }
}

StyledHtmlReport.propTypes = {
    reportData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    generateHtmlReport: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({ id: PropTypes.string }),
    }),
    location: PropTypes.shape({ search: PropTypes.string }),
}

export default connect(
    state => ({ reportData: state.reportData.content }),
    {
        generateHtmlReport,
    }
)(StyledHtmlReport)

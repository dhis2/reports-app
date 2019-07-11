import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { InputField, Button } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import { getApi, getD2 } from '../../utils/api'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'

// const isCommentingActionEnabled = comment => comment.trim()
// const actionButtonPlaceholder = i18n.t('Share')
// const inputFieldPlaceholder = i18n.t(
//     'Write a comment, question or interpretation of this report'
// )

// export const ReportComment = props => (
//     <div id="share-component">
//         <div>
//             <InputField
//                 placeholder={inputFieldPlaceholder}
//                 type="text"
//                 multiline
//                 fullWidth
//                 value={props.comment}
//                 onChange={props.setDataSetReportComment}
//             />
//             <Button
//                 raised
//                 color="primary"
//                 onClick={props.shareDataSetReportComment}
//                 disabled={!isCommentingActionEnabled(props.comment)}
//             >
//                 {actionButtonPlaceholder}
//             </Button>
//         </div>
//         <style jsx>{`
//             div > div {
//                 margin: 16px 0;
//             }
//         `}</style>
//     </div>
// )

// ReportComment.propTypes = {
//     comment: PropTypes.string.isRequired,
//     shareDataSetReportComment: PropTypes.func.isRequired,
//     setDataSetReportComment: PropTypes.func.isRequired,
// }
export class ReportCommentComponent extends React.Component {
    state = {
        interpretations: null,
    }

    // componentDidMount() {
    //     const { dataSet, reportPeriod, organisationUnits } = this.props.state
    //     const api = getApi()
    //     api.get(
    //         `interpretations?fields=*,comments[*]&filter=dataSet.id:eq:${
    //             dataSet.selected.id
    //         }&filter=organisationUnit.id:eq:${
    //             organisationUnits.selected.id
    //         }&filter=period.id:eq:${reportPeriod.selectedPeriod}&paging=false`
    //     )
    //         .then(({ interpretations }) => {
    //             this.setState({ interpretations })
    //         })
    //         .catch(console.error)
    // }

    test = (a, b, c, d) => {
        console.log('calbackie', a, b, c, d)
    }
    render() {
        // if (!this.state.interpretations) {
        //     return null
        // }

        return (
            <React.Fragment>
                {/* <ul>
                    {this.state.interpretations.map(({ text }, i) => (
                        <li key={i}>{text}</li>
                    ))}
                </ul> */}
                <InterpretationsComponent
                    d2={getD2()}
                    id={this.props.state.dataSet.selected.id}
                    type="dataSet"
                    currentInterpretationId={undefined}
                    onCurrentInterpretationChange={undefined}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    state: state,
})

const ReportComment = connect(mapStateToProps)(ReportCommentComponent)

ReportComment.propTypes = {
    comment: PropTypes.string.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
}

export { ReportComment }

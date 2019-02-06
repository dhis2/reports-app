import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../utils/i18n/locales'
import styles from '../../utils/styles'
import { getDocsUrl } from '../../utils/getDocsUrl'
import { If } from '../../components/conditional/If'
import PageHelper from '../../components/page-helper/PageHelper'

export const Headline = props => (
    <h1>
        <If condition={!props.showForm}>
            <span
                id="back-button"
                style={styles.backButton}
                className="material-icons"
                role="button"
                tabIndex="0"
                onClick={props.onBackClick}
            />
        </If>

        {i18n.t('Data Set Report')}

        <PageHelper url={getDocsUrl(props.systemVersion, props.sectionKey)} />
    </h1>
)

Headline.propTypes = {
    showForm: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func.isRequired,
    systemVersion: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
}

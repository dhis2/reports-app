import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import styles from './StandardReport.style'

const SearchBox = ({ value, onChange }) => (
    <div id="search-box-id" style={styles.searchContainer}>
        <InputField
            id="search-std-report-id"
            value={value}
            type="text"
            hintText={i18n.t('Search')}
            onChange={onChange}
        />
    </div>
)

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default SearchBox

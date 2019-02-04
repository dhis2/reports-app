import React from 'react';
import PropTypes from 'prop-types';
import { InputField } from '@dhis2/d2-ui-core';
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';
import styles from './StandardReport.style';

const SearchBox = ({ value, onChange }) => (
    <div id="search-box-id" style={styles.searchContainer}>
        <InputField
            id="search-std-report-id"
            value={value}
            type="text"
            hintText={i18n.t(i18nKeys.standardReport.search)}
            onChange={onChange}
        />
    </div>
);

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SearchBox;

import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsUrl } from '../../utils/getDocsUrl';
import styles from './StandardReport.style';

const Headline = ({ showBackButton, onGoBackClick, systemVersion, sectionKey }) => (
    <h1>
        { showBackButton &&
            <span
                id="back-button"
                style={styles.backButton}
                className="material-icons"
                role="button"
                tabIndex="0"
                onClick={onGoBackClick}
            />
        }
        { i18n.t(i18nKeys.standardReport.homeLabel) }
        <PageHelper
            url={getDocsUrl(systemVersion, sectionKey)}
        />
    </h1>
);

Headline.propTypes = {
    showBackButton: PropTypes.bool.isRequired,
    onGoBackClick: PropTypes.func.isRequired,
    systemVersion: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
};

export default Headline;

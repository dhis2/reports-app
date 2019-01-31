import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

const NoResultsMessage = ({ additionalStyles }) => (
    <p
        id="no-std-report-find-message-id"
        style={{ textAlign: 'center', ...additionalStyles }}
    >
        {i18n.t(i18nKeys.messages.noResultsFound)}
    </p>
);

NoResultsMessage.propTypes = {
    additionalStyles: PropTypes.object,
};

NoResultsMessage.defaultProps = {
    additionalStyles: {},
};

export default NoResultsMessage;

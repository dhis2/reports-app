import React from 'react';
import PropTypes from 'prop-types';
import { Button, SvgIcon } from '@dhis2/d2-ui-core';
import appStyles from '../../utils/styles';

const AddReportButton = ({ onClick }) => (
    <div id="add-std-report-btn-container-id">
        <Button
            fab
            id="add-std-report-btn-id"
            onClick={onClick}
            style={appStyles.addButton}
        >
            <SvgIcon icon="Add" />
        </Button>
    </div>
);

AddReportButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddReportButton;

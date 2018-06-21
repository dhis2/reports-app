/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { InputField, Button } from '@dhis2/d2-ui-core';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import styles from '../../styles';

class Share extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        comment: PropTypes.string,
    }

    static defaultProps = {
        comment: '',
    }

    render() {
        return (
            <div>
                <span style={styles.formLabel}>{i18n.t(i18nKeys.dataSetReport.shareLabel)}</span>
                <InputField
                    placeholder={i18n.t(i18nKeys.dataSetReport.sharePlaceholder)}
                    type="text"
                    multiline
                    fullWidth
                    value={this.props.comment}
                    onChange={this.props.onChange}
                />
                <Button
                    raised
                    color="primary"
                    onClick={this.props.onSubmit}
                >
                    {i18n.t(i18nKeys.dataSetReport.share)}
                </Button>
            </div>
        );
    }
}

export default Share;

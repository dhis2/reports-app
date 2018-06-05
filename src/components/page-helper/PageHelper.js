/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* styles */
import styles from './PageHelper.style';

class PageHelper extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    render() {
        return (
            <a
                style={styles.container}
                className="helper-icon"
                href={this.props.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span
                    className="material-icons"
                    style={styles.icon}
                >
                        help
                </span>
            </a>
        );
    }
}

export default PageHelper;

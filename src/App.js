/* React */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

/* React Router */
// import { Link } from 'react-router-dom';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import {Sidebar} from '@dhis2/d2-ui-core';

/* App configs */
import {sections} from './pages/sections.conf';

/* styles */
import styles from './styles';

class App extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.state = {
            currentSection: '',
        };
    }

    render() {
        const nonOnChangeSection = () => null;
        const sidebarSections = sections.map(section => Object.assign(
            section,
            {
                icon: section.info.icon,
                label: section.info.label,
                /* containerElement: <Link to={section.path} />, */
            },
        ));
        return (
            <D2UIApp>
                <div style={styles.leftBar}>
                    <Sidebar
                        styles={styles}
                        sections={sidebarSections}
                        currentSection={this.state.currentSection}
                        onChangeSection={nonOnChangeSection}
                    />
                </div>
                <HeaderBar d2={this.props.d2}/>
            </D2UIApp>
        );
    }
}

export default App;

/* React */
import { Component } from 'react';
import PropTypes from 'prop-types';

class Page extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
        currentSection: PropTypes.string.isRequired,
        updateAppState: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.pageMounted = true;

        // update section on side bar
        if (this.props.currentSection !== this.props.sectionKey) {
            this.props.updateAppState({
                currentSection: this.props.sectionKey,
            });
        }
    }

    componentWillUnmount() {
        this.pageMounted = false;
    }

    isPageMounted() {
        return this.pageMounted;
    }
}

export default Page;

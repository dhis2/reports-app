/* React */
import React, { Component } from 'react';

/* d2-ui */
import HeaderBar from '@dhis2/d2-ui-header-bar';

class App extends Component {
  render() {
      return (<HeaderBar d2={this.props.d2} />);
  }
}

export default App;

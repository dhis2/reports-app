/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

import Report from '../Report'

it('Report renders without crashing', () => {
    shallow(<Report reportHtml="<div>Hello World</div>" />)
})

import { Route, Switch } from 'react-router-dom'
import React from 'react'

import { shallow } from 'enzyme'

import AppRouter from '../AppRouter'
import { sectionOrder } from '../../config/sections.config'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({ OrgUnitTree: 'OrgUnitTree' }))

jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

const ownShallow = () => shallow(<AppRouter />)

it('AppRouter renders without crashing', () => {
    ownShallow()
})

it('AppRouter renders the correct number of Route', () => {
    const wrapper = ownShallow()

    // Pages plus home and no match route
    expect(wrapper.find(Route)).toHaveLength(sectionOrder.length + 2)
})

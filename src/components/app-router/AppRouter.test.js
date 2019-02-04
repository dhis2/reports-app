/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

import AppRouter from './AppRouter'
import { Route, Switch } from 'react-router-dom'

import { sections } from '../../pages/sections.conf'

const pageState = {}

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(<AppRouter pageState={pageState} />, {
        disableLifecycleMethods: true,
    })
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

it('AppRouter renders without crashing', () => {
    ownShallow()
})

it('AppRouter renders a Switch', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(Switch)).toHaveLength(1)
})

it('AppRouter renders the correct number of Route', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(Route)).toHaveLength(sections.length + 2) // Pages plus home and no match route
})

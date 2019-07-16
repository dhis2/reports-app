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

it('Matches the snapshot', () => {
    expect(ownShallow()).toMatchSnapshot()
})

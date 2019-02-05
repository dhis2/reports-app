/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

import DataApproval from './DataApproval'

import fakerData from '../../utils/fakerTests'

import { sections, DATA_APPROVAL_SECTION_KEY } from '../sections.conf'

let pageInfo = {}
for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === DATA_APPROVAL_SECTION_KEY) {
        pageInfo = section.info
        break
    }
}

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(
        <DataApproval
            sectionKey={DATA_APPROVAL_SECTION_KEY}
            pageInfo={pageInfo}
            currentSection={DATA_APPROVAL_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

describe('Test <DataApproval /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('renders without crashing', () => {
        ownShallow()
    })
})

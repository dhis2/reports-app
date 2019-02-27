/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

import { Button } from '@dhis2/d2-ui-core'

import OrganisationUnitDistributionReport from './OrganisationUnitDistributionReport'
import OrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree'
import GroupSets from '../../components/GroupSetsDropdown'
import ReportTable from '../../components/TabularReport/ReportTable'

import fakerData from '../../utils/fakerTests'

import {
    sections,
    ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
} from '../../config/sections.conf'

let pageInfo = {}
for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY) {
        pageInfo = section.info
        break
    }
}

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(
        <OrganisationUnitDistributionReport
            sectionKey={ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY}
            pageInfo={pageInfo}
            currentSection={ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <OrganisationUnitDistributionReport /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should display form', () => {
        expect(
            wrapper.find('#org-unit-dist-report-form').props().style.display
        ).toBe('block')
    })

    it('Should render form with correct components', () => {
        const form = wrapper.find('#org-unit-dist-report-form')
        expect(form.find(OrganisationUnitsTree)).toHaveLength(1)
        expect(form.find(GroupSets)).toHaveLength(1)
        expect(form.find(Button)).toHaveLength(2)
    })

    it('Should display no form when showForm is false', () => {
        wrapper.setState({ showForm: false })
        expect(
            wrapper.find('#org-unit-dist-report-form').props().style.display
        ).toBe('none')
    })

    it('Should have the form Button disabled', () => {
        const form = wrapper.find('#org-unit-dist-report-form')
        expect(
            form
                .find(Button)
                .at(0)
                .props().disabled
        ).toBeTruthy()
        expect(
            form
                .find(Button)
                .at(1)
                .props().disabled
        ).toBeTruthy()
    })

    it('Should enable form Button', () => {
        wrapper.setState({
            selectedOrgUnit: 'OrgUnitId',
            selectedGroupSet: 'GroupSetId',
            loading: false,
        })
        wrapper.update()
        const form = wrapper.find('#org-unit-dist-report-form')
        expect(
            form
                .find(Button)
                .at(0)
                .props().disabled
        ).toBeFalsy()
        expect(
            form
                .find(Button)
                .at(1)
                .props().disabled
        ).toBeFalsy()
    })

    it('Should render no report container', () => {
        expect(wrapper.find('#report-container')).toHaveLength(0)
    })

    it('Should render the correct components on report container', () => {
        wrapper.setState({
            reportHtml: '<div>Report</div>',
            showForm: false,
        })
        const reportContainer = wrapper.find('#report-container')
        expect(reportContainer.find('span')).toHaveLength(1) // Download button
        expect(reportContainer.find(ReportTable)).toHaveLength(1)
    })
})

describe('Test <OrganisationUnitDistributionReport /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should update selectedGroupSet when Group Set selected', () => {
        const groupSetId = 'fakeDataSetId'
        wrapper.find(GroupSets).simulate('change', groupSetId)
        expect(wrapper.state('selectedGroupSet')).toEqual(groupSetId)
    })

    it('Should call getReport function when form button is clicked.', () => {
        wrapper.instance().getReport = jest.fn()
        wrapper.setState({
            selectedOrgUnit: 'OrgUnitId',
            selectedGroupSet: 'GroupSetId',
            loading: false,
        })
        wrapper.update()
        wrapper
            .find('#org-unit-dist-report-form')
            .find(Button)
            .at(0)
            .simulate('click')
        expect(wrapper.instance().getReport).toHaveBeenCalled()
    })

    it('Should call getChart function when form button is clicked.', () => {
        wrapper.instance().getChart = jest.fn()
        wrapper.setState({
            selectedOrgUnit: 'OrgUnitId',
            selectedGroupSet: 'GroupSetId',
            loading: false,
        })
        wrapper.update()
        wrapper
            .find('#org-unit-dist-report-form')
            .find(Button)
            .at(1)
            .simulate('click')
        expect(wrapper.instance().getChart).toHaveBeenCalled()
    })

    it('Should call exportReportToXls function when download button is clicked.', () => {
        wrapper.instance().exportReportToXls = jest.fn()
        wrapper.setState({
            reportHtml: '<div>Report</div>',
            showForm: false,
        })
        wrapper.update()
        wrapper
            .find('#report-container')
            .find('span')
            .simulate('click')
        expect(wrapper.instance().exportReportToXls).toHaveBeenCalled()
    })
})

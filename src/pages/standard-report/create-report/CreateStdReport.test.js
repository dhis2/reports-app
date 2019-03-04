import React from 'react'
import { mount, shallow } from 'enzyme'
import CreateStdReport from './CreateStdReport'
import OrganisationUnitsTree from '../../../components/AvailableOrganisationUnitsTree'
import { Dialog } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Button, SelectField } from '@dhis2/d2-ui-core'
import fakerData from '../../../utils/fakerTests'
import { TYPES } from '../standard.report.conf'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const periods = [
    {
        name: 'August 2018',
        externalAccess: false,
        displayName: 'August 2018',
        favorite: false,
        id: '201808',
    },
    {
        name: 'July 2018',
        externalAccess: false,
        displayName: 'July 2018',
        favorite: false,
        id: '201807',
    },
    {
        name: 'June 2018',
        externalAccess: false,
        displayName: 'June 2018',
        favorite: false,
        id: '201806',
    },
]

const params = {
    paramGrandParentOrganisationUnit: false,
    paramParentOrganisationUnit: false,
    paramOrganisationUnit: true,
    paramReportingPeriod: true,
}

const ownShallow = () => {
    return shallow(
        <CreateStdReport
            d2={fakerData.d2}
            selectedReport={{ id: 'CreateReportId', type: TYPES.HTML }}
            onRequestClose={jest.fn()}
            onGetReportData={jest.fn()}
            open={true}
            onError={jest.fn()}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <CreateStdReport /> rendering:', () => {
    let wrapper
    let dialog
    beforeEach(() => {
        wrapper = ownShallow()
        wrapper.setState({ periods, params })
        dialog = wrapper.find(Dialog)
    })

    it('Should render without crashing.', () => {
        ownShallow()
    })

    it('Should open a dialog if report isSet.', () => {
        expect(dialog.props().open).toBe(true)
    })

    it('Should have correct title.', () => {
        expect(dialog.props().title).toBe('Create Report Table')
    })

    it('Should allow to select "Reporting Period".', () => {
        expect(dialog.find(SelectField)).toHaveLength(1)
        expect(dialog.find(SelectField).props().items).toHaveLength(3)
    })

    it('Should allow to select "Organisation Unit".', () => {
        expect(dialog.find(OrganisationUnitsTree)).toHaveLength(1)
    })

    it.skip('Should display "Cancel", "Download as Excel" and "Get Report" actions.', () => {
        const actions = mount(
            <MuiThemeProvider>
                <span>{dialog.props().actions}</span>
            </MuiThemeProvider>
        )
        expect(actions.find(Button)).toHaveLength(3)
        expect(
            actions
                .find(Button)
                .at(0)
                .text()
        ).toBe('Cancel')
        expect(
            actions
                .find(Button)
                .at(1)
                .text()
        ).toBe('Download as excel')
        expect(
            actions
                .find(Button)
                .at(2)
                .text()
        ).toBe('Get Report')
    })
})

describe('Test <CreateStdReport /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    /* load report params */
    it('Should call loadReportParams when mount.', () => {
        wrapper.instance().loadReportParams = jest.fn()
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().loadReportParams).toHaveBeenCalled()
    })

    /* load report params */
    it('Should call loadReportParams when selected different report.', () => {
        wrapper.instance().loadReportParams = jest.fn()
        wrapper
            .instance()
            .componentWillReceiveProps({ selectedReport: { id: 'newId' } })
        expect(wrapper.instance().loadReportParams).toHaveBeenCalled()
    })

    it('Should call onChangePeriod when selected period changes.', () => {
        wrapper.instance().onChangePeriod = jest.fn()
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        wrapper.find('[selector="periods"]').simulate('change', '201809')
        expect(wrapper.instance().onChangePeriod).toHaveBeenCalled()
    })

    it('Should call onChangeOrgUnit when selected Organisation Unit changes.', () => {
        wrapper.instance().onChangeOrgUnit = jest.fn()
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        wrapper.find(OrganisationUnitsTree).simulate('change', '201809')
        expect(wrapper.instance().onChangeOrgUnit).toHaveBeenCalled()
    })

    it.skip('Should call getExcelReport when export as excel button is clicked.', () => {
        wrapper.instance().getExcelReport = jest.fn()
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        const actions = mount(
            <MuiThemeProvider>
                <span>{wrapper.find(Dialog).props().actions}</span>
            </MuiThemeProvider>
        )
        actions
            .find(Button)
            .at(1)
            .find('button')
            .simulate('click')
        expect(wrapper.instance().getExcelReport).toHaveBeenCalled()
    })

    it.skip('Should call getReport when get report button clicked.', () => {
        wrapper.instance().getReport = jest.fn()
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        const actions = mount(
            <MuiThemeProvider>
                <span>{wrapper.find(Dialog).props().actions}</span>
            </MuiThemeProvider>
        )
        actions
            .find(Button)
            .at(2)
            .find('button')
            .simulate('click')
        expect(wrapper.instance().getReport).toHaveBeenCalled()
    })

    it('Should test if report isSet.', () => {
        expect(wrapper.instance().isSet()).toBe(false)
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        expect(wrapper.instance().isSet()).toBe(true)
    })

    it('Should test if isOrganisationUnitSet.', () => {
        expect(wrapper.instance().isOrganisationUnitSet()).toBe(false)
        wrapper.setState({
            params: {
                paramGrandParentOrganisationUnit: true,
                paramParentOrganisationUnit: true,
                paramOrganisationUnit: true,
                paramReportingPeriod: true,
            },
        })
        expect(wrapper.instance().isOrganisationUnitSet()).toBe(true)
    })

    it('Should test if isReportingPeriod.', () => {
        expect(wrapper.instance().isReportingPeriod()).toBe(false)
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        expect(wrapper.instance().isReportingPeriod()).toBe(true)
    })

    it('Should validate user selections.', () => {
        expect(wrapper.instance().validate()).toBe(false)
        wrapper.setState({
            periods,
            params,
            selectedPeriod: '201807',
            selectedOrgUnitId: 'OrgUnit',
        })
        expect(wrapper.instance().validate()).toBe(true)
    })
})

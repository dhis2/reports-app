import { defaultState, orgUnitDistReport } from '../orgUnitDistReport'
import {
    loadingChartImageUrlError,
    loadingChartImageUrlStart,
    loadingChartImageUrlSuccess,
} from '../../actions/orgUnitDistReport'
import {
    loadingReportDataStart,
    actionTypes as reportDataActionTypes,
} from '../../actions/reportData'

describe('Reducer - orgUnitDistReport', () => {
    it('should return the default state', () => {
        expect(orgUnitDistReport()).toEqual(defaultState)
    })

    it('should start loading and display image when loading chart image', () => {
        const action = loadingChartImageUrlStart()
        const preState = {
            ...defaultState,
            displayImage: false,
            chartImageLoading: false,
        }
        const postState = orgUnitDistReport(preState, action)
        const expectedState = {
            ...preState,
            displayImage: true,
            chartImageLoading: true,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should stop loading when the chart image has loaded successfully', () => {
        const action = loadingChartImageUrlSuccess()
        const preState = {
            ...defaultState,
            chartImageLoading: true,
        }
        const postState = orgUnitDistReport(preState, action)
        const expectedState = {
            ...preState,
            chartImageLoading: false,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should stop loading and hide image when chart image did not load successfully', () => {
        const action = loadingChartImageUrlError()
        const preState = {
            ...defaultState,
            displayImage: true,
            chartImageLoading: true,
        }
        const postState = orgUnitDistReport(preState, action)
        const expectedState = {
            ...preState,
            displayImage: false,
            chartImageLoading: false,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should hide the image when loading the html report', () => {
        const action = loadingReportDataStart()
        const preState = {
            ...defaultState,
            displayImage: true,
        }
        const postState = orgUnitDistReport(preState, action)
        const expectedState = {
            ...preState,
            displayImage: false,
        }

        expect(postState).toEqual(expectedState)
    })
})

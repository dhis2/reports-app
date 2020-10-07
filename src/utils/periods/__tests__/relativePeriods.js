import { getRelativePeriodStartDate } from '../relativePeriods.js'

describe('getRelativePeriodStartDate', () => {
    beforeAll(() => {
        // Groundhog day: 2020-09-22
        jest.spyOn(global.Date, 'now').mockImplementation(
            () => '2020-09-22T10:00:00Z'
        )
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('returns the correct start date for relative period "thisDay"', () => {
        expect(getRelativePeriodStartDate('thisDay')).toEqual('2020-09-22')
    })
    it('returns the correct start date for relative period "yesterday"', () => {
        expect(getRelativePeriodStartDate('yesterday')).toEqual('2020-09-21')
    })
    it('returns the correct start date for relative period "last3Days"', () => {
        expect(getRelativePeriodStartDate('last3Days')).toEqual('2020-09-19')
    })
    it('returns the correct start date for relative period "last7Days"', () => {
        expect(getRelativePeriodStartDate('last7Days')).toEqual('2020-09-15')
    })
    it('returns the correct start date for relative period "last14Days"', () => {
        expect(getRelativePeriodStartDate('last14Days')).toEqual('2020-09-08')
    })
    it('returns the correct start date for relative period "thisWeek"', () => {
        expect(getRelativePeriodStartDate('thisWeek')).toEqual('2020-09-21')
    })
    it('returns the correct start date for relative period "lastWeek"', () => {
        expect(getRelativePeriodStartDate('lastWeek')).toEqual('2020-09-14')
    })
    it('returns the correct start date for relative period "last4Weeks"', () => {
        expect(getRelativePeriodStartDate('last4Weeks')).toEqual('2020-08-24')
    })
    it('returns the correct start date for relative period "last12Weeks"', () => {
        expect(getRelativePeriodStartDate('last12Weeks')).toEqual('2020-06-29')
    })
    it('returns the correct start date for relative period "last52Weeks"', () => {
        expect(getRelativePeriodStartDate('last52Weeks')).toEqual('2019-09-23')
    })
    it('returns the correct start date for relative period "weeksThisYear"', () => {
        expect(getRelativePeriodStartDate('weeksThisYear')).toEqual(
            '2019-12-30'
        )
    })
    it('returns the correct start date for relative period "thisMonth"', () => {
        expect(getRelativePeriodStartDate('thisMonth')).toEqual('2020-09-01')
    })
    it('returns the correct start date for relative period "lastMonth"', () => {
        expect(getRelativePeriodStartDate('lastMonth')).toEqual('2020-08-01')
    })
    it('returns the correct start date for relative period "last3Months"', () => {
        expect(getRelativePeriodStartDate('last3Months')).toEqual('2020-06-01')
    })
    it('returns the correct start date for relative period "last6Months"', () => {
        expect(getRelativePeriodStartDate('last6Months')).toEqual('2020-03-01')
    })
    it('returns the correct start date for relative period "last12Months"', () => {
        expect(getRelativePeriodStartDate('last12Months')).toEqual('2019-09-01')
    })
    it('returns the correct start date for relative period "monthsThisYear"', () => {
        expect(getRelativePeriodStartDate('monthsThisYear')).toEqual(
            '2020-01-01'
        )
    })
    it('returns the correct start date for relative period "thisBimonth"', () => {
        expect(getRelativePeriodStartDate('thisBimonth')).toEqual('2020-09-01')
    })
    it('returns the correct start date for relative period "lastBimonth"', () => {
        expect(getRelativePeriodStartDate('lastBimonth')).toEqual('2020-07-01')
    })
    it('returns the correct start date for relative period "last6BiMonths"', () => {
        expect(getRelativePeriodStartDate('last6BiMonths')).toEqual(
            '2019-09-01'
        )
    })
    it('returns the correct start date for relative period "biMonthsThisYear"', () => {
        expect(getRelativePeriodStartDate('biMonthsThisYear')).toEqual(
            '2020-01-01'
        )
    })
    it('returns the correct start date for relative period "thisQuarter"', () => {
        expect(getRelativePeriodStartDate('thisQuarter')).toEqual('2020-07-01')
    })
    it('returns the correct start date for relative period "lastQuarter"', () => {
        expect(getRelativePeriodStartDate('lastQuarter')).toEqual('2020-04-01')
    })
    it('returns the correct start date for relative period "last4Quarters"', () => {
        expect(getRelativePeriodStartDate('last4Quarters')).toEqual(
            '2019-07-01'
        )
    })
    it('returns the correct start date for relative period "quartersThisYear"', () => {
        expect(getRelativePeriodStartDate('quartersThisYear')).toEqual(
            '2020-01-01'
        )
    })
    it('returns the correct start date for relative period "thisSixMonth"', () => {
        expect(getRelativePeriodStartDate('thisSixMonth')).toEqual('2020-07-01')
    })
    it('returns the correct start date for relative period "lastSixMonth"', () => {
        expect(getRelativePeriodStartDate('lastSixMonth')).toEqual('2020-01-01')
    })
    it('returns the correct start date for relative period "last2SixMonths"', () => {
        expect(getRelativePeriodStartDate('last2SixMonths')).toEqual(
            '2019-07-01'
        )
    })
    it('returns the correct start date for relative period "thisFinancialYear"', () => {
        expect(getRelativePeriodStartDate('thisFinancialYear')).toEqual(
            '2020-10-01'
        )
    })
    it('returns the correct start date for relative period "lastFinancialYear"', () => {
        expect(getRelativePeriodStartDate('lastFinancialYear')).toEqual(
            '2019-10-01'
        )
    })
    it('returns the correct start date for relative period "last5FinancialYears"', () => {
        expect(getRelativePeriodStartDate('last5FinancialYears')).toEqual(
            '2015-10-01'
        )
    })
    it('returns the correct start date for relative period "thisYear"', () => {
        expect(getRelativePeriodStartDate('thisYear')).toEqual('2020-01-01')
    })
    it('returns the correct start date for relative period "lastYear"', () => {
        expect(getRelativePeriodStartDate('lastYear')).toEqual('2019-01-01')
    })
    it('returns the correct start date for relative period "last5Years"', () => {
        expect(getRelativePeriodStartDate('last5Years')).toEqual('2015-01-01')
    })
})

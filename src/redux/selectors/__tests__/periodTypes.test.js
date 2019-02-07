import pluckPeriodTypes from '../periodTypes'

describe('pluckPeriodTypes', () => {
    const periodTypes = [
        { name: 'Daily' },
        { name: 'WeeklyWednesday' },
        { name: 'BiWeekly' },
    ]

    const expectedOutput = [
        { id: 'Daily', displayName: 'Daily' },
        { id: 'WeeklyWednesday', displayName: 'Weekly Wednesday' },
    ]

    it('transforms the input array correctly', () => {
        expect(pluckPeriodTypes(periodTypes)).toEqual(expectedOutput)
    })
    it('skips the BiWeekly period type', () => {
        expect(pluckPeriodTypes(periodTypes)).toHaveLength(2)
    })
})

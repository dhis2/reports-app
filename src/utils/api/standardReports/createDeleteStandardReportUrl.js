import { REPORTS_ENDPOINT } from './constants'

/**
 * @param {string} id
 * @return {string}
 */
const createDeleteStandardReportUrl = id => `${REPORTS_ENDPOINT}/${id}`

export default createDeleteStandardReportUrl

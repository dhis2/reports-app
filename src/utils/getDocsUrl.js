import { getDocsKeyForSection } from '../pages/sections.conf'

export const DOCS_LINK = 'https://ci.dhis2.org/docs'
export const DEFAULT_DOC_LANGUAGE = 'en'

/**
 * Returns the "version" of the documentation that corresponds with the current dhis2 version.
 *
 * @param {Object} version - The version definition as provided by d2.system.version.
 * @param {number} version.minor - The minor dhis2 version. e.g. The 25 in 2.25.
 * @param {boolean} version.snapshot - True when the current version is the snapshot(master/development) branch.
 *
 * @returns {string} `master` for a snapshot branch. `25` for 2.25 etc.
 */
const getDocsVersion = ({ major, minor, snapshot }) => {
    if (snapshot) {
        return 'master'
    }
    return `${major}.${minor}`
}

export const getDocsUrl = (systemVersion, sectionKey, lng) => {
    const docLng = lng || DEFAULT_DOC_LANGUAGE
    return `${DOCS_LINK}/${getDocsVersion(
        systemVersion
    )}/${docLng}/user/html/${getDocsKeyForSection(sectionKey)}.html`
}

export default getDocsUrl

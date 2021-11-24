import { sections } from '../../../config/sections.config.js'

export const getCurrentSection = (state) =>
    state.router.location.pathname.substring(1)

export const getShowSidebar = (state) => !!sections[getCurrentSection(state)]

import { Link } from 'react-router-dom'
import React from 'react'

import { sectionOrder, sections } from '../../config/sections.config'
import MenuElement from '../../components/MenuElement'

const Home = () => {
    const menuCards = sectionOrder.map(sectionKey => {
        const element = sections[sectionKey]

        return (
            <div key={element.key} className="col-sm-12 col-md-6 col-lg-4">
                <Link to={element.path} className="menu-card-link">
                    <MenuElement entry={element.info} />
                </Link>
                <style jsx>{`
                    div {
                        margin-bottom: 8px;
                    }
                    div :global(.menu-card-link) {
                        text-decoration: none !important;
                    }
                `}</style>
            </div>
        )
    })

    return (
        <div id={'menu-grid-id'} className="row">
            {menuCards}
        </div>
    )
}

export default Home

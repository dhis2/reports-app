import React from 'react'
import { Link } from 'react-router-dom'

import MenuElement from '../../components/MenuElement'

import { sections } from '../sections.conf'
import styles from './Home.style'

const Home = () => {
    // TODO: Check translations
    const menuCards = sections.map(element => (
        <div
            key={element.key}
            className={'col-sm-12 col-md-6 col-lg-4'}
            style={styles.menuElementContainer}
        >
            <Link to={element.path}>
                <MenuElement entry={element.info} />
            </Link>
        </div>
    ))

    return (
        <div id={'menu-grid-id'} className={'row'}>
            {menuCards}
        </div>
    )
}

export default Home

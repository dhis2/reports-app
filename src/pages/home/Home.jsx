import { Link } from 'react-router-dom'
import MenuElement from '../../components/MenuElement.jsx'
import { sectionOrder, sections } from '../../config/sections.config.js'
import styles from './Home.module.css'

const Home = () => {
    const menuCards = sectionOrder.map((sectionKey) => {
        const element = sections[sectionKey]

        return (
            <div
                key={element.key}
                className={`col-sm-12 col-md-6 col-lg-4 ${styles.menuCardWrapper}`}
            >
                <Link to={element.path} className={styles.menuCardLink}>
                    <MenuElement entry={element.info} />
                </Link>
            </div>
        )
    })

    return (
        <div id="menu-grid-id" className="row">
            {menuCards}
        </div>
    )
}

export default Home

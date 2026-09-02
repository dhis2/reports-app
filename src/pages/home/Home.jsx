import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import { navGroups } from '../../components/shell/navigation.js'
import { sections } from '../../config/sections.config.js'
import styles from './Home.module.css'

/*
 * The landing page. One card per section: its name and a line saying what it
 * is for. The list comes from the same navigation source as the breadcrumb,
 * so the two can never disagree.
 */
const items = navGroups.flatMap((group) => group.items)

const Home = () => (
    <div id="menu-grid-id" className={styles.page}>
        <header className={styles.intro}>
            <h1 className={styles.title}>{i18n.t('Reports')}</h1>
        </header>

        <div className={styles.grid}>
            {items.map((item) => {
                const { info } = sections[item.key]

                return (
                    <Link
                        key={item.key}
                        to={item.path}
                        className={styles.cardLink}
                        data-test="menu-element"
                    >
                        <div className={styles.card}>
                            <div className={styles.body}>
                                <h2 className={styles.name}>{info.label}</h2>
                                <p
                                    className={styles.description}
                                    data-test="section-description"
                                >
                                    {item.question || info.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    </div>
)

export default Home

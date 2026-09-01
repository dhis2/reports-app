import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import MenuElement from '../../components/MenuElement.jsx'
import { navGroups } from '../../components/shell/navigation.js'
import { sections } from '../../config/sections.config.js'
import styles from './Home.module.css'

/*
 * The landing page used to show five equal cards in a bootstrap grid, in the
 * same order as the menu, with no indication that some belong together. It
 * now uses the same grouping as the navigation, so the two agree.
 */
const Home = () => (
    <div id="menu-grid-id" className={styles.page}>
        <header className={styles.intro}>
            <h1 className={styles.title}>{i18n.t('Reports')}</h1>
            <p className={styles.lead}>
                {i18n.t(
                    'Formal output from your data: a filled-in form, a record of what arrived, a register of your facilities, the reports your team designed, and the documents that go with them.'
                )}
            </p>
        </header>

        {navGroups.map((group) => (
            <section className={styles.group} key={group.label}>
                <h2 className={styles.groupTitle}>
                    {group.label}
                    {group.hint && (
                        <span className={styles.groupHint}>{group.hint}</span>
                    )}
                </h2>

                <div className={styles.grid}>
                    {group.items.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={styles.cardLink}
                        >
                            <MenuElement
                                entry={sections[item.key].info}
                                sectionKey={item.key}
                            />
                        </Link>
                    ))}
                </div>
            </section>
        ))}
    </div>
)

export default Home

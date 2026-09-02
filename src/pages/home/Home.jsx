import i18n from '@dhis2/d2-i18n'
import { Card, IconArrowRight16 } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { navGroups } from '../../components/shell/navigation.js'
import { sections } from '../../config/sections.config.js'
import styles from './Home.module.css'
import { SectionArt } from './SectionArt.jsx'

/*
 * The landing page. One large card per section, each showing a drawing of the
 * output it produces, so the choice can be made by looking rather than by
 * reading four descriptions. The list comes from the same navigation source
 * as the section switcher, so the two can never disagree.
 */
const items = navGroups.flatMap((group) => group.items)

const Home = () => (
    <div id="menu-grid-id" className={styles.page}>
        <header className={styles.intro}>
            <h1 className={styles.title}>{i18n.t('Reports')}</h1>
            <p className={styles.lead}>
                {i18n.t(
                    'Formal output from your data: a filled-in form, a register of your facilities, the reports your team designed, and the documents that go with them.'
                )}
            </p>
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
                        <Card className={styles.card}>
                            <div className={styles.preview}>
                                <SectionArt sectionKey={item.key} />
                            </div>

                            <div className={styles.body}>
                                <h2 className={styles.name}>
                                    {info.label}
                                    <span
                                        className={styles.arrow}
                                        aria-hidden="true"
                                    >
                                        <IconArrowRight16 />
                                    </span>
                                </h2>
                                <p
                                    className={styles.description}
                                    data-test="section-description"
                                >
                                    {item.question || info.description}
                                </p>
                            </div>
                        </Card>
                    </Link>
                )
            })}
        </div>
    </div>
)

export default Home

import React from 'react'
import PropTypes from 'prop-types'

/* Material UI */
import Paper from '@material-ui/core/Paper'

const MenuElement = ({ entry }) => (
    <Paper className="section">
        <div className="section-title-bar">
            <div className="section-name">{entry.label}</div>
            <span className="material-icons icon section-icon">
                {entry.icon}
            </span>
        </div>
        <div className="section-description">{entry.description}</div>
        <div className="section-action-text">{entry.actionText}</div>
        <style jsx>{`
            .section {
                box-sizing: border-box;
                display: inline-block;
                position: relative;
                min-width: 200px;
                min-height: 218px;
                height: 100%;
                padding-left: 30px;
                padding-right: 30px;
                padding-bottom: 20px;
                background-color: #ffffff;
                box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px,
                    rgba(0, 0, 0, 0.12) 0px 1px 4px;
                border-radius: 5px;
                width: 100%;
            }
            .section-title-bar {
                margin-top: 28px;
                min-height: 42px;
                flex-wrap: nowrap;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .section-name {
                font-size: 24px;
                text-align: left;
                color: #000000;
            }
            .section-icon {
                float: right;
                color: #757575;
                font-size: 50px;
            }
            .section-description {
                font-size: 14px;
                text-align: left;
                color: #757575;
                margin-top: 38px;
                margin-bottom: 38px;
                display: block;
            }
            .section-action-text {
                position: absolute;
                bottom: 20px;
                display: block;
                font-size: 16px;
                font-weight: 600;
                text-align: left;
                color: #2196f3;
            }
        `}</style>
    </Paper>
)

MenuElement.propTypes = {
    entry: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        actionText: PropTypes.string,
    }).isRequired,
}

export default MenuElement

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { useState, useRef } from 'react'
import i18n from '@dhis2/d2-i18n'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Popper from '@material-ui/core/Popper'
import CircularProgress from '@material-ui/core/CircularProgress'
import red from '@material-ui/core/colors/red'
import { Input } from './Input'
import { formInput, formInputMeta } from '../../utils/react/propTypes'
import {
    loadFilteredStandardReportTables,
    clearSearch,
    MIN_CHAR_LENGTH,
} from '../../redux/actions/standardReportTables'

const centeredStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
}

const errorStyle = {
    ...centeredStyle,
    color: red[500],
}

const infoStyle = {
    ...centeredStyle,
    color: '#494949,',
    fontStyle: 'italic',
}

const getListContent = ({ onClick, loading, error, collection, noMatches }) => {
    if (loading) {
        return (
            <div style={centeredStyle}>
                <CircularProgress />
            </div>
        )
    } else if (error) {
        return <div style={errorStyle}>{error}</div>
    } else if (noMatches) {
        return <div style={infoStyle}>{i18n.t('No matches found')}</div>
    } else if (collection.length > 0) {
        return collection.map(item => {
            return (
                <MenuItem
                    key={item.value}
                    onClick={() => onClick(item.value, item.label)}
                >
                    {item.label}
                </MenuItem>
            )
        })
    } else {
        return null
    }
}

export const ReportTableSearchInputUI = props => {
    const inputRef = useRef()
    const [isSearchMode, setSearchMode] = useState(false)
    const [reportTableName, setReportTableName] = useState('')
    const showResults =
        isSearchMode && props.searchTerm.length >= MIN_CHAR_LENGTH
    const showHint = isSearchMode && props.searchTerm.length < MIN_CHAR_LENGTH
    const onFocus = () => {
        if (!isSearchMode) {
            setSearchMode(true)
        }
        props.input.onFocus && props.input.onFocus()
    }
    const onBlur = () => {
        if (isSearchMode) {
            // HACK: when clicking on a list item the onBlur event
            // of the input happens first and the onClick event on the
            // list item second. This timeout works around that problem
            // but we probably need a more structural fix
            setTimeout(() => {
                setSearchMode(false)
            }, 250)
        }
        props.input.onBlur && props.input.onBlur()
    }
    const onSearch = event => {
        props.loadFilteredStandardReportTables(event.target.value)
    }
    const usedValue = isSearchMode
        ? props.searchTerm
        : reportTableName || props.persistedReportTableName
    const inputProps = {
        ...props,
        helpText: showHint
            ? i18n.t('Please enter at least {{count}} characters', {
                  count: MIN_CHAR_LENGTH,
              })
            : undefined,
        input: {
            ...props.input,
            value: usedValue,
            onFocus: onFocus,
            onChange: isSearchMode ? onSearch : props.input.onChange,
            onBlur: isSearchMode ? onBlur : props.input.onBlur,
            placeholder: i18n.t('Type to search a report table'),
            inputRef,
            autoComplete: 'off',
        },
    }
    const onChange = (value, label) => {
        setSearchMode(false)
        setReportTableName(label)
        props.clearSearch()
        props.input.onChange(value)
    }

    return (
        <React.Fragment>
            <Input {...inputProps} />

            <Popper
                open={showResults}
                anchorEl={inputRef.current}
                style={{
                    width: inputRef.current?.offsetWidth,
                }}
            >
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                    {getListContent({
                        onClick: onChange,
                        loading: props.loading,
                        error: props.error,
                        collection: props.collection,
                        noMatches: props.noMatches,
                    })}
                </Paper>
            </Popper>
        </React.Fragment>
    )
}

ReportTableSearchInputUI.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    input: formInput.isRequired,
    loadFilteredStandardReportTables: PropTypes.func.isRequired,
    meta: formInputMeta.isRequired,
    placeholder: PropTypes.string.isRequired,
    collection: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    noMatches: PropTypes.bool,
    persistedReportTableName: PropTypes.string,
    searchTerm: PropTypes.string,
}

const mapStateToProps = state => ({
    searchTerm: state.standardReportTables.searchTerm,
    collection: state.standardReportTables.collection,
    loading: state.standardReportTables.loading,
    error: state.standardReportTables.error,
    noMatches: state.standardReportTables.noMatches,
    persistedReportTableName:
        (state.standardReport.selectedReport.reportTable &&
            state.standardReport.selectedReport.reportTable.displayName) ||
        '',
})

export const ReportTableSearchInput = connect(mapStateToProps, {
    loadFilteredStandardReportTables,
    clearSearch,
})(ReportTableSearchInputUI)

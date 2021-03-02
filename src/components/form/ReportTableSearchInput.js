import React from 'react'
import PropTypes from 'prop-types'
import deburr from 'lodash/deburr'
import Downshift from 'downshift'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
// import { formInput, formInputMeta } from '../../utils/react/propTypes'

const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' },
]

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    )
}

function renderSuggestion({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
}) {
    const isHighlighted = highlightedIndex === index
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.label}
        </MenuItem>
    )
}
renderSuggestion.propTypes = {
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
}

function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase()
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
              const keep =
                  count < 5 &&
                  suggestion.label.slice(0, inputLength).toLowerCase() ===
                      inputValue

              if (keep) {
                  count += 1
              }

              return keep
          })
}

const CompiePompie = props => {
    const classes = props.classes || {}
    return (
        <Downshift id="downshift-simple">
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                selectedItem,
            }) => (
                <div className={classes.container}>
                    {renderInput({
                        fullWidth: true,
                        classes,
                        InputProps: getInputProps({
                            placeholder: 'Search a country (start with a)',
                        }),
                    })}
                    <div {...getMenuProps()}>
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                {getSuggestions(inputValue).map(
                                    (suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({
                                                item: suggestion.label,
                                            }),
                                            highlightedIndex,
                                            selectedItem,
                                        })
                                )}
                            </Paper>
                        ) : null}
                    </div>
                </div>
            )}
        </Downshift>
    )
}

CompiePompie.propTypes = {
    classes: PropTypes.object.isRequired,
}

export const ReportTableSearchInput = props => {
    console.log(props)
    return <CompiePompie />
}

// ReportTableSearchInput.propTypes = {
//     input: formInput.isRequired,
//     meta: formInputMeta.isRequired,
//     placeholder: PropTypes.string.isRequired,
// }

export const isRequired = value => (value ? undefined : 'Required')

export const isRequiredWhen = when => (value, values) =>
    when(values) ? isRequired(value) : undefined

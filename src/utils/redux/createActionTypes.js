const createActionTypes = (...actionTypeNames) => actionTypeNames.reduce(
    (actionTypes, actionTypeName) => ({
        ...actionTypes,
        [actionTypeName]: Symbol(actionTypeName),
    }),
    {},
);

export default createActionTypes;

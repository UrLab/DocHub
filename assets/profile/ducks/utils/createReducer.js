let __DEV__ = false;
try {
  __DEV__ = process.env.NODE_ENV !== 'production';
} catch (e) {}

export default (initialState, handlers) => {
  if (__DEV__ && handlers.undefined) {
    console.warn(
      'Reducer contains an \'undefined\' action type. ' +
      'Have you misspelled a constant?'
    );
  }

  return (state, action) => {
    if (state === undefined) state = initialState;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
};

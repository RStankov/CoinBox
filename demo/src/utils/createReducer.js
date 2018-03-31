export default function createReducer(initialState, handlers = {}) {
  return function reducer(state = initialState, action) {
    if (!action || !action.type) {
      return state;
    }

    const handler = handlers[action.type];

    if (!handler) {
      return state;
    }

    return handler(state, action);
  };
}

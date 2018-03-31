import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import * as navigation from 'modules/navigation';
import thunk from 'redux-thunk';

export default function createReduxStore(reducers = {}, initialState = {}) {
  const combinedReducers = combineReducers({
    ...reducers,
  });

  const middlewares = [
    applyMiddleware(thunk),
    applyMiddleware(navigation.middleware),
  ];

  return createStore(combinedReducers, initialState, compose(...middlewares));
}

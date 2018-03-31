import React from 'react';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import AppNavigator from 'screens';

// name

export const name = 'navigation';

// reducer

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Home'),
);

export function reducer(state = initialState, action) {
  return AppNavigator.router.getStateForAction(action, state) || state;
}

// action

export function navigateTo(routeName, params) {
  return NavigationActions.navigate({ routeName, params });
}

export function navigateBack(params = {}) {
  return NavigationActions.back(params);
}

// selector

export function getNavigator(state) {
  return state[name];
}

// middleware

export const middleware = createReactNavigationReduxMiddleware(
  'root',
  getNavigator,
);

// HOC

const addListener = createReduxBoundAddListener('root');

function Navigation({ dispatch, navigation }) {
  return (
    <AppNavigator
      navigation={addNavigationHelpers({
        dispatch: dispatch,
        state: navigation,
        addListener,
      })}
    />
  );
}

export const NavigationProvider = connect(state => ({
  navigation: getNavigator(state),
}))(Navigation);

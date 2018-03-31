import ApolloClient from 'apollo-boost';
import React from 'react';
import createReduxStore from 'utils/createReduxStore';
import reducers from './modules';
import { ApolloProvider } from 'react-apollo';
import { NavigationProvider } from 'modules/navigation';
import { Provider } from 'react-redux';

const GAME_API_KEY = 'cfa15679bebeda6035c9d08676b9f5bf6b234c06';

const redux = createReduxStore(reducers);

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  request: async operation => {
    // const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: `Bearer ${GAME_API_KEY}`,
      },
    });
  },
});

export default function App() {
  return (
    <Provider store={redux}>
      <ApolloProvider client={client}>
        <NavigationProvider />
      </ApolloProvider>
    </Provider>
  );
}

import ApolloClient from 'apollo-boost';
import React from 'react';
import createReduxStore from 'utils/createReduxStore';
import reducers from './modules';
import { ApolloProvider } from 'react-apollo';
import { NavigationProvider } from 'modules/navigation';
import { Provider } from 'react-redux';

const redux = createReduxStore(reducers);

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
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

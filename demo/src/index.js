import React from 'react';
import createReduxStore from 'utils/createReduxStore';
import createApolloClient from 'utils/createApolloClient';
import reducers from './modules';
import { ApolloProvider } from 'react-apollo';
import { NavigationProvider } from 'modules/navigation';
import { Provider } from 'react-redux';

const redux = createReduxStore(reducers);

const client = createApolloClient({
  apiKey: 'cfa15679bebeda6035c9d08676b9f5bf6b234c06',
  host: 'http://localhost:3000',
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

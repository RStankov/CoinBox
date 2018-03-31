import ApolloClient from 'apollo-boost';
import { getToken } from 'utils/authentication';

export default function createApolloClient({ apiKey, host }) {
  return new ApolloClient({
    uri: `${host}/graphql`,
    request: async operation => {
      const playerToken = await getToken();
      const token = playerToken ? `${apiKey}-${playerToken}` : apiKey;

      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    },
  });
}

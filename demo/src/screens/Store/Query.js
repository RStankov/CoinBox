import gql from 'graphql-tag';
import Card from 'components/Card/Fragment';

export default gql`
  query {
    viewer {
      id
    }
    game {
      id
      store {
        edges {
          node {
            ...Card
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Card}
`;

import gql from 'graphql-tag';
import Card from 'components/Card/Fragment';

export default gql`
  query {
    viewer {
      id
      wallet {
        transferables {
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
  }
  ${Card}
`;

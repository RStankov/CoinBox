import gql from 'graphql-tag';
import Card from 'components/Card/Fragment';
import Wallet from 'components/Wallet/Fragment';

export default gql`
  query {
    viewer {
      id
      ...Wallet
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
  ${Wallet}
  ${Card}
`;

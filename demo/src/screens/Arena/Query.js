import gql from 'graphql-tag';
import PlayerCard from 'components/PlayerCard/Fragment';
import Wallet from 'components/Wallet/Fragment';

export default gql`
  query {
    viewer {
      id
      ...Wallet
    }
    game {
      id
      players {
        edges {
          node {
            ...PlayerCard
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${PlayerCard}
  ${Wallet}
`;

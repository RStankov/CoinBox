import gql from 'graphql-tag';
import PlayerCard from 'components/PlayerCard/Fragment';

export default gql`
  query {
    viewer {
      id
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
`;

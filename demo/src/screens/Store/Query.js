import gql from 'graphql-tag';

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
            id
            name
            image(size: 60)
            properties
            price {
              amount
              consumable {
                id
                name
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

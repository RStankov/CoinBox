import gql from 'graphql-tag';

export default gql`
  {
    game {
      id
      name
      store {
        edges {
          node {
            id
            name
            properties
            image(size: 400)
            price {
              amount
              consumable {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

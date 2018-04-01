import gql from 'graphql-tag';

export default gql`
  fragment Card on Transferable {
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
`;

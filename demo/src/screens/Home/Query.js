import gql from 'graphql-tag';

export default gql`
  {
    viewer {
      id
      username
    }
    game {
      id
      name
    }
  }
`;

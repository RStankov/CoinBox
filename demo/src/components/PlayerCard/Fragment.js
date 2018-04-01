import gql from 'graphql-tag';

export default gql`
  fragment PlayerCard on Player {
    id
    username
  }
`;

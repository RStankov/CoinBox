import gql from 'graphql-tag';

export default gql`
  mutation SignIn($email: String!, $password: String!) {
    response: playerSignIn(input: { email: $email, password: $password }) {
      node {
        accessToken
      }
      errors {
        field
        messages
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const GET_USER_TOKEN = gql`
  query generateUserToken($email: String!, $password: String!) {
    generateUserToken(email: $email, password: $password)
  }
`;

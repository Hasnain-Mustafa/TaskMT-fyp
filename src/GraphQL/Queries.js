import { gql } from '@apollo/client';

export const GET_USER_TOKEN = gql`
  query generateUserToken($email: String!, $password: String!) {
    generateUserToken(email: $email, password: $password)
  }
`;
export const GET_CURRENT_USER=gql `
query GetCurrentLoggedInUser {
  getCurrentLoggedInUser {
    id
    email
    name
    isManager
    password
    assignedProjectIds
  }
}

`;
import { gql } from "@apollo/client";

export const SIGN_UP_MUTATION = gql`
  mutation signUpUser(
    $email: String
    $name: String
    $password: String
    $isManager: Boolean

  ) {
    signUpUser(
      email: $email
      name: $name
      password: $password
      isManager: $isManager
    ) 
    
  }
`;

// authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '../../ApolloClient'; // Import your GraphQL client instance
import { gql } from "@apollo/client";
const GET_USER_TOKEN = gql`
mutation GenerateUserToken($email: String!, $password: String!) {
  generateUserToken(email: $email, password: $password) {
    id
    email
    name
    userToken
    isManager
    assignedProjectIds
  }
}
`;
const SIGN_UP_MUTATION = gql`
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

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, name, password, isManager }, { rejectWithValue }) => {
    try {
    
      const request = await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables:{email, name, password, isManager }
    })
    const data =  request;
    console.log(data,"test result")
      //   const [signUpUser, { error }] = useMutation(SIGN_UP_MUTATION);
      // const response = await client.mutate({
      //   mutation: SIGN_UP_MUTATION,
      //   variables: {  email, name, password, isManager},
      // });

      // Assuming your server returns user data upon successful registration
      // return response.data.signUpUser;
    } catch (error) {
      // Handle error
      console.error('Registration failed:', error);
      return rejectWithValue(error.message);
    }
  }
);



export const userLogin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
    
      const request = await client.mutate({
        mutation: GET_USER_TOKEN,
        variables:{email,  password }
    })
    const {data} =  request;
    localStorage.setItem('userToken', data.generateUserToken.userToken)
      // Assuming your server returns user data and token upon successful login
   
      return data.generateUserToken;
    } catch (error) {
      // Handle error
      console.error('Login failed:', error);
      return rejectWithValue(error.message);
    }
  }
);


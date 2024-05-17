// authActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../ApolloClient"; // Import your GraphQL client instance
import { gql } from "@apollo/client";
const DELETE_CHATS = gql`
  mutation DeleteChats($userId: ID!) {
    deleteChats(userId: $userId) {
      userId
    }
  }
`;
const DELETE_NOTIFICATIONS = gql`
  mutation DeleteNotifications($userId: ID!) {
    deleteNotifications(userId: $userId) {
      userId
    }
  }
`;

const ADD_CHATS = gql`
  mutation AddChats($chat: ChatInput!) {
    addChats(chat: $chat) {
      id
      image
      message
      sender
      desc
      time
      userId
    }
  }
`;
const ADD_NOTIFICATIONS = gql`
  mutation AddNotifications(
    $userId: ID!
    $notification: [NotificationInput!]!
  ) {
    addNotifications(userId: $userId, notification: $notification) {
      id
      image
      message
      desc
      time
      userId
    }
  }
`;
const GET_USER_TOKEN = gql`
  mutation GenerateUserToken($email: String!, $password: String!) {
    generateUserToken(email: $email, password: $password) {
      id
      email
      name
      userToken
      isManager
      assignedProjectIds
      photoURL
    }
  }
`;
const GET_OAUTH_TOKEN = gql`
  mutation generateOAuthToken($email: String!) {
    generateOAuthToken(email: $email) {
      id
      email
      name
      userToken
      isManager
      assignedProjectIds
      photoURL
    }
  }
`;
const OAUTH_SIGNUP_MUTATION = gql`
  mutation signUpWithOAuth(
    $email: String
    $name: String
    $isManager: Boolean
    $photoURL: String
  ) {
    signUpWithOAuth(
      email: $email
      name: $name
      isManager: $isManager
      photoURL: $photoURL
    )
  }
`;
const UPDATE_PICTURE_MUTATION = gql`
  mutation updateProfilePicture($email: String, $photoURL: String) {
    updateProfilePicture(email: $email, photoURL: $photoURL) {
      id
      email
      name
      isManager
      assignedProjectIds
      photoURL
    }
  }
`;
const SIGN_UP_MUTATION = gql`
  mutation signUpUser(
    $email: String
    $name: String
    $password: String
    $isManager: Boolean
    $photoURL: String
  ) {
    signUpUser(
      email: $email
      name: $name
      password: $password
      isManager: $isManager
      photoURL: $photoURL
    )
  }
`;
const DELETE_GOALS = gql`
  mutation DeleteGoals($goalId: ID!) {
    deleteGoals(goalId: $goalId) {
      id
    }
  }
`;
const ADD_GOALS = gql`
  mutation AddGoals($userId: ID!, $goal: [GoalInput!]!) {
    addGoals(userId: $userId, goal: $goal) {
      id
      text
      isCompleted
      userId
    }
  }
`;
const UPDATE_GOALS = gql`
  mutation UpdateGoals($goalId: ID!, $isCompleted: Boolean!) {
    updateGoals(goalId: $goalId, isCompleted: $isCompleted) {
      text
      isCompleted
      id
      userId
    }
  }
`;
export const updatePicture = createAsyncThunk(
  "auth/updatePicture",
  async ({ email, photoURL }, { rejectWithValue }) => {
    console.log(email);
    try {
      // const request = await client.mutate({
      //   mutation: UPDATE_PICTURE_MUTATION,
      //   variables: { email, photoURL },
      // });
      // const data = request;
      // console.log(data);
      const request = await client.mutate({
        mutation: UPDATE_PICTURE_MUTATION,
        variables: { email, photoURL },
      });
      const { data } = request;

      return data.updateProfilePicture;
    } catch (error) {
      // Handle error
      console.error("Image update failed:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const registerWithOAuth = createAsyncThunk(
  "auth/resgisterWithOAuth",
  async ({ email, name, isManager, photoURL }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: OAUTH_SIGNUP_MUTATION,
        variables: { email, name, isManager, photoURL },
      });

      const { data } = request;
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const OAuthLogin = createAsyncThunk(
  "auth/OAuthlogin",
  async ({ email }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: GET_OAUTH_TOKEN,
        variables: { email },
      });
      const { data } = request;
      // Store user token in localStorage
      localStorage.setItem("userToken", data.generateOAuthToken.userToken);
      localStorage.setItem("userInfo", JSON.stringify(data.generateOAuthToken));

      return data.generateOAuthToken;
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { email, name, password, isManager, photoURL },
    { rejectWithValue }
  ) => {
    try {
      const request = await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: { email, name, password, isManager, photoURL },
      });
      const data = request;
      console.log(data, "test result");
      //   const [signUpUser, { error }] = useMutation(SIGN_UP_MUTATION);
      // const response = await client.mutate({
      //   mutation: SIGN_UP_MUTATION,
      //   variables: {  email, name, password, isManager},
      // });

      // Assuming your server returns user data upon successful registration
      // return response.data.signUpUser;
    } catch (error) {
      // Handle error
      console.error("Registration failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: GET_USER_TOKEN,
        variables: { email, password },
      });
      const { data } = request;
      localStorage.setItem("userToken", data.generateUserToken.userToken);
      // Assuming your server returns user data and token upon successful login

      return data.generateUserToken;
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const pushNotifications = createAsyncThunk(
  "auth/pushNotifications",
  async ({ userId, notification }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: ADD_NOTIFICATIONS,
        variables: { userId, notification },
      });
      const { data } = request;

      return data.addNotifications;
    } catch (error) {
      // Handle error
      console.error("Error adding notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const chatNotifications = createAsyncThunk(
  "auth/chatNotifications",
  async ({ chat }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: ADD_CHATS,
        variables: { chat },
      });
      const { data } = request;

      return data.addChats;
    } catch (error) {
      // Handle error
      console.error("Error adding chat notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const addGoals = createAsyncThunk(
  "auth/addGoals",
  async ({ userId, goal }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: ADD_GOALS,
        variables: { userId, goal },
      });
      const { data } = request;

      return data.addGoals;
    } catch (error) {
      // Handle error
      console.error("Error adding goals:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteGoals = createAsyncThunk(
  "auth/deleteGoals",
  async ({ goalId }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_GOALS,
        variables: { goalId },
      });
      const { data } = request;

      return data.deleteGoals;
    } catch (error) {
      // Handle error
      console.error("Error deleting goals:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteChats = createAsyncThunk(
  "auth/deleteChats",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_CHATS,
        variables: { userId },
      });
      const { data } = request;

      return data.deleteChats;
    } catch (error) {
      // Handle error
      console.error("Error deleting chats:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteNotifications = createAsyncThunk(
  "auth/deleteNotifications",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_NOTIFICATIONS,
        variables: { userId },
      });
      const { data } = request;

      return data.deleteNotifications;
    } catch (error) {
      // Handle error
      console.error("Error deleting notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateGoals = createAsyncThunk(
  "auth/updateGoals",
  async ({ goalId, isCompleted }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: UPDATE_GOALS,
        variables: { goalId, isCompleted },
      });
      const { data } = request;

      return data.updateGoals;
    } catch (error) {
      // Handle error
      console.error("Error updating goals:", error);
      return rejectWithValue(error.message);
    }
  }
);
// Helper function to store user info in Redux store without sensitive information
const setUserInfoInStorage = (userInfo) => {
  const userInfoForStorage = { ...userInfo };
  delete userInfoForStorage.password;
  delete userInfoForStorage.salt;
  localStorage.setItem("userInfo", JSON.stringify(userInfoForStorage));
};

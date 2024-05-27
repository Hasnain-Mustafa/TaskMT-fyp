import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "@apollo/client"; // Assuming you're using Apollo Client

export const authApi = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    url: "https://taskmt-server.fly.dev/graphql",

    prepareHeaders: (headers, { getState }) => {
      // Retrieve token from redux store
      const token = getState().auth?.userToken;

      if (token) {
        headers.set("authorization", token);
      } else {
        // use refresh token or navigate to login
      }
      return headers;
    },
  }),

  endpoints: (builder) => {
    return {
      GetCurrentLoggedInUser: builder.query({
        query: () => ({
          document: gql`
            query GetCurrentLoggedInUser {
              getCurrentLoggedInUser {
                id
                email
                name
                isManager
                assignedProjectIds
                photoURL
              }
            }
          `,
          variables: {},
        }),
        // Pass your GraphQL query here
        transformResponse: (response) => response,
      }),
      GetNotifications: builder.query({
        query: ({ userId }) => ({
          document: gql`
            query GetNotifications($userId: String!) {
              getNotifications(userId: $userId) {
                id
                image
                message
                desc
                time
              }
            }
          `,
          variables: { userId },
        }),
        transformResponse: (response) => response,
      }),
      GetChats: builder.query({
        query: ({ userId }) => ({
          document: gql`
            query GetChats($userId: String!) {
              getChats(userId: $userId) {
                message
                id
                image
                sender
                desc
                time
                userId
              }
            }
          `,
          variables: { userId },
        }),
        transformResponse: (response) => response,
      }),
      GetGoals: builder.query({
        query: ({ userId }) => ({
          document: gql`
            query GetGoals($userId: String!) {
              getGoals(userId: $userId) {
                id
                text
                isCompleted
              }
            }
          `,
          variables: { userId },
        }),
        transformResponse: (response) => response,
      }),
    };
  },
});

// Export react hook
export const {
  useGetCurrentLoggedInUserQuery,
  useGetNotificationsQuery,
  useGetGoalsQuery,
  useGetChatsQuery,
} = authApi;

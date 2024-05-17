import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { gql } from "@apollo/client";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:3000/graphql",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      } else {
        // Optionally handle cases like redirecting to login or refreshing token
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: ({ creatorId }) => ({
        document: gql`
          query GetAllProjects($creatorId: String!) {
            getAllProjects(creatorId: $creatorId) {
              id
              title
              status
              summary
              weeks
              budget
              assigneeDetails {
                email
                name
                id
              }
              creatorId
            }
          }
        `,
        variables: { creatorId },
      }),
    }),

    getAllProjectsAssigned: builder.query({
      query: ({ assigneeId }) => ({
        document: gql`
          query GetAllProjectsAssigned($assigneeId: String!) {
            getAllProjectsAssigned(assigneeId: $assigneeId) {
              id
              title
              status
              summary
              weeks
              budget
              assigneeDetails {
                id
                email
                name
              }
              creatorId
            }
          }
        `,
        variables: { assigneeId },
      }),
    }),
  }),
});

export const { useGetAllProjectsQuery, useGetAllProjectsAssignedQuery } =
  projectsApi;

import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "@apollo/client";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:3000/graphql",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userToken;
      if (token) {
        headers.set("authorization", token);
      } else {
        // Handle the case when token is not available
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      GetAssignedTasks: builder.query({
        query: ({ projectId, taskAssigneeId }) => ({
          document: gql`
            query GetAssignedTasks(
              $projectId: String!
              $taskAssigneeId: String!
            ) {
              getAssignedTasks(
                projectId: $projectId
                taskAssigneeId: $taskAssigneeId
              ) {
                id
                Title
                Status
                Summary
                type
                priority
                dueDate
                startDate
                taskAssigneeId
                projectId
                taskCreatorId
              }
            }
          `,
          variables: { projectId, taskAssigneeId },
        }),
        transformResponse: (response) => response,
      }),
      getCreatedTasksById: builder.query({
        query: ({ taskCreatorId }) => ({
          document: gql`
            query GetCreatedTasksById($taskCreatorId: String!) {
              getCreatedTasksById(taskCreatorId: $taskCreatorId) {
                id
                Title
                Status
                Summary
                type
                priority
                dueDate
                startDate
                taskAssigneeId
                projectId
                taskCreatorId
              }
            }
          `,
          variables: { taskCreatorId },
        }),
        transformResponse: (response) => response,
      }),
      getAllCreatedTasksById: builder.query({
        query: ({ taskCreatorId }) => ({
          document: gql`
            query GetAllCreatedTasksById($taskCreatorId: String!) {
              getAllCreatedTasksById(taskCreatorId: $taskCreatorId) {
                id
                Title
                Status
                Summary
                type
                priority
                dueDate
                startDate
                taskAssigneeId
                projectId
                taskCreatorId
              }
            }
          `,
          variables: { taskCreatorId },
        }),
        transformResponse: (response) => response,
      }),
      getAllAssignedTasksById: builder.query({
        query: ({ taskAssigneeId }) => ({
          document: gql`
            query GetAllAssignedTasksById($taskAssigneeId: String!) {
              getAllAssignedTasksById(taskAssigneeId: $taskAssigneeId) {
                id
                Title
                Status
                Summary
                priority
                startDate
                dueDate
                taskAssigneeId
                type
                projectId
                taskCreatorId
              }
            }
          `,
          variables: { taskAssigneeId },
        }),
        transformResponse: (response) => response,
      }),
      getAssignedTasksById: builder.query({
        query: ({ taskAssigneeId }) => ({
          document: gql`
            query GetAssignedTasksById($taskAssigneeId: String!) {
              getAssignedTasksById(taskAssigneeId: $taskAssigneeId) {
                Summary
                id
                Title
                Status
                type
                priority
                dueDate
                startDate
                taskAssigneeId
                projectId
                taskCreatorId
                turnedInAt
              }
            }
          `,
          variables: { taskAssigneeId },
        }),
        transformResponse: (response) => response,
      }),

      GetCreatedTasks: builder.query({
        query: ({ projectId, taskCreatorId }) => ({
          document: gql`
            query GetCreatedTasks(
              $projectId: String!
              $taskCreatorId: String!
            ) {
              getCreatedTasks(
                projectId: $projectId
                taskCreatorId: $taskCreatorId
              ) {
                id
                Title
                Status
                Summary
                type
                priority
                dueDate
                startDate
                taskAssigneeId
                projectId
                taskCreatorId
              }
            }
          `,
          variables: { projectId, taskCreatorId },
        }),
        transformResponse: (response) => response,
      }),
    };
  },
});

export const {
  useGetAssignedTasksQuery,
  useGetCreatedTasksQuery,
  useGetCreatedTasksByIdQuery,
  useGetAssignedTasksByIdQuery,
  useGetAllAssignedTasksByIdQuery,
  useGetAllCreatedTasksByIdQuery,
} = tasksApi;

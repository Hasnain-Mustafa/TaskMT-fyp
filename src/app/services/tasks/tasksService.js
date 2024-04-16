import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from '@apollo/client';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:3000/graphql",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userToken;
      if (token) {
        headers.set('authorization', token);
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
            query GetAssignedTasks($projectId: String!, $taskAssigneeId: String!) {
              getAssignedTasks(projectId: $projectId, taskAssigneeId: $taskAssigneeId) {
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
              }
            }
          `,
          variables: { projectId, taskAssigneeId }
        }),
        transformResponse: (response) => response,
      }),
      GetTaskAssigneeById: builder.query({
        query: ({ taskAssigneeId }) => ({
          document: gql`
            query GetTaskAssigneeById($taskAssigneeId: String!) {
              getTaskAssigneeById(taskAssigneeId: $taskAssigneeId) {
                name
                email
                isManager
              }
            }
          `,
          variables: { taskAssigneeId }
        }),
        transformResponse: (response) => response,
      })
    };
  }
});

export const { useGetAssignedTasksQuery, useGetTaskAssigneeByIdQuery } = tasksApi;

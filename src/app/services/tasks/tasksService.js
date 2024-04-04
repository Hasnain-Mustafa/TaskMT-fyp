
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import { createApi} from '@reduxjs/toolkit/query/react'

import { gql } from '@apollo/client';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:3000/graphql",
    
    prepareHeaders: (headers, { getState }) => {
    // Retrieve token from redux store
      const token = getState().auth?.userToken 

      if (token) {
        headers.set('authorization', token)
      } else {
        // use refresh token or navigate to login
      }
      return headers
    },
  }),
  
  endpoints: (builder) => ({
    GetAssignedTasks: builder.query({
      query: ({ projectId,taskAssigneeId }) => ({
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
          }`, variables: {projectId,taskAssigneeId }})
     
    
      }),
      transformResponse: (response) => response,
    }),
  })



export const { useGetAssignedTasksQuery } = tasksApi;

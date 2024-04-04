
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import { createApi} from '@reduxjs/toolkit/query/react'

import { gql } from '@apollo/client';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
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
    GetAllProjects: builder.query({
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
              assigneeIds
           
            }
          }`, variables: {creatorId}})
     
    
      }),
      transformResponse: (response) => response,
    }),
  })



export const { useGetAllProjectsQuery } = projectsApi;

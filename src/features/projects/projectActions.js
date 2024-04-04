import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../ApolloClient'; // Import your GraphQL client instance
import { gql } from '@apollo/client';

const CREATE_PROJECT_MUTATION = gql`
mutation CreateProject($title: String, $status: String, $summary: String, $weeks: String, $budget: String, $assigneeEmails: [String], $creatorId: ID) {
  createProject(title: $title, status: $status, summary: $summary, weeks: $weeks, budget: $budget, assigneeEmails: $assigneeEmails, creatorId: $creatorId) {
    id
    title
    status
    summary
    weeks
    budget
    assigneeIds
  }
}
`;

const UPDATE_PROJECT_MUTATION = gql`mutation UpdateProject($projectId: ID!, $title: String, $status: String, $summary: String, $weeks: String, $budget: String, $assigneeEmails: [String]) {
    updateProject(projectId: $projectId, title: $title, status: $status, summary: $summary, weeks: $weeks, budget: $budget, assigneeEmails: $assigneeEmails)
  }`;

const DELETE_PROJECT_MUTATION = gql`mutation DeleteProject($projectId: ID!) {
  deleteProject(projectId: $projectId) {
    id
  }
}`;

export const createProject = createAsyncThunk(
  'projects/createProject',
  async ({title, status, summary, weeks, budget, assigneeEmails, creatorId}, { rejectWithValue }) => {
    try {
   
      const request = await client.mutate({
        mutation: CREATE_PROJECT_MUTATION,
        variables:{title, status, summary, weeks, budget, assigneeEmails, creatorId}
    })
     
 
        const {data} =  request;
      console.log(data.createProject)
      return data.createProject;
       
          
        } catch (error) {
          // Handle error
          console.error('Project Creation Failed:', error);
          return rejectWithValue(error.message);
        }
      }
    );
    
    export const updateProject = createAsyncThunk(
        'projects/updateProject',
        async ({ projectId, title, status, summary, weeks, budget, assigneeEmails}, { rejectWithValue }) => {
          try {
            const request = await client.mutate({
              mutation: UPDATE_PROJECT_MUTATION,
              variables:{projectId, title, status, summary, weeks, budget, assigneeEmails}
          })
           
              const data =  request;
              console.log(data,"test result")
                
              } catch (error) {
                // Handle error
                console.error('Project Updation Failed:', error);
                return rejectWithValue(error.message);
              }
            }
          );
          
export const deleteProject = createAsyncThunk(
            'projects/deleteProject',
            async ({ projectId}, { rejectWithValue }) => {
              try {
                const request = await client.mutate({
                  mutation: DELETE_PROJECT_MUTATION,
                  variables:{projectId}
              })
               
                  const {data} =  request;
                  console.log(data,"test result")
                    return data.deleteProject;
                  } catch (error) {
                    // Handle error
                    console.error('Project Deletion Failed:', error);
                    return rejectWithValue(error.message);
                  }
                }
              );
              
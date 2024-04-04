import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../ApolloClient'; // Import your GraphQL client instance
import { gql } from '@apollo/client';

const CREATE_TASK_MUTATION = gql`
mutation CreateTask($title: String, $status: String, $summary: String, $type: String, $priority: String, $dueDate: String, $startDate: String, $taskAssigneeEmail: String, $projectId: ID) {
    createTask(title: $title, status: $status, summary: $summary, type: $type, priority: $priority, dueDate: $dueDate, startDate: $startDate, taskAssigneeEmail: $taskAssigneeEmail, projectId: $projectId) {
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
`;

const UPDATE_TASK_MUTATION = gql`mutation UpdateTask($taskId: ID!, $title: String, $status: String, $summary: String, $type: String, $priority: String, $dueDate: String, $startDate: String, $taskAssigneeId: String) {
    updateTask(taskId: $taskId, title: $title, status: $status, summary: $summary, type: $type, priority: $priority, dueDate: $dueDate, startDate: $startDate, taskAssigneeId: $taskAssigneeId) {
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
  }`;

const DELETE_TASK_MUTATION = gql`mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
    }
  }`;

  export const createTask = createAsyncThunk(
    'projects/createTask',
    async ({ title, status, summary, type, priority, dueDate, startDate, taskAssigneeEmail, projectId }, { rejectWithValue }) => {
      try {
        const request = await client.mutate({
          mutation: CREATE_TASK_MUTATION,
          variables: { title, status, summary, type, priority, dueDate, startDate, taskAssigneeEmail, projectId }
        });
  
        const { data } = request;
        const createdTask = data.createTask;
  
        // Format the created task object
        const formattedTask = {
          id: createdTask.id,
          Title: createdTask.Title,
          Status: createdTask.Status,
          Summary: createdTask.Summary,
          type: createdTask.type,
          priority: createdTask.priority,
          dueDate: createdTask.dueDate,
          startDate: createdTask.startDate,
          taskAssigneeId: createdTask.taskAssigneeId,
          projectId: createdTask.projectId
        };
  
        return formattedTask;
      } catch (error) {
        // Handle error
        console.error('Task Creation Failed:', error);
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const updateTask = createAsyncThunk(
    'projects/updateTask',
    async ({ taskId, title, status, summary, type, priority, dueDate, startDate, taskAssigneeId }, { rejectWithValue }) => {
      try {
        const request = await client.mutate({
          mutation: UPDATE_TASK_MUTATION,
          variables: { taskId, title, status, summary, type, priority, dueDate, startDate, taskAssigneeId }
        });
        
        const { data } = request;
       
     
        return  data.updateTask
      } catch (error) {
        // Handle error
        console.error('Task Updation Failed:', error);
        return rejectWithValue(error.message);
      }
    }
  );
  
          
export const deleteTask = createAsyncThunk(
            'projects/deleteTask',
            async ({taskId}, { rejectWithValue }) => {
              try {
                const request = await client.mutate({
                  mutation: DELETE_TASK_MUTATION,
                  variables:{taskId}
              })
               
                  const {data} =  request;
                    return data.deleteTask;
                  } catch (error) {
                    // Handle error
                    console.error('Task Deletion Failed:', error);
                    return rejectWithValue(error.message);
                  }
                }
              );
              
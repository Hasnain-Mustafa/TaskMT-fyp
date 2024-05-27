import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../ApolloClient"; // Import your GraphQL client instance
import { gql } from "@apollo/client";

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask(
    $title: String
    $status: String
    $summary: String
    $type: String
    $priority: String
    $dueDate: String
    $startDate: String
    $taskAssigneeEmail: String
    $projectId: ID
    $taskCreatorId: ID
    $turnedInAt: String
  ) {
    createTask(
      title: $title
      status: $status
      summary: $summary
      type: $type
      priority: $priority
      dueDate: $dueDate
      startDate: $startDate
      taskAssigneeEmail: $taskAssigneeEmail
      projectId: $projectId
      taskCreatorId: $taskCreatorId
      turnedInAt: $turnedInAt
    ) {
      turnedInAt
      taskCreatorId
      projectId
      assigneeURL {
        photoURL
      }
      id
      Title
      Status
      Summary
      type
      priority
      dueDate
      startDate
      taskAssigneeId
    }
  }
`;

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $taskId: ID!
    $title: String
    $status: String
    $summary: String
    $type: String
    $priority: String
    $dueDate: String
    $startDate: String
    $taskAssigneeId: String
    $turnedInAt: String
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      status: $status
      summary: $summary
      type: $type
      priority: $priority
      dueDate: $dueDate
      startDate: $startDate
      taskAssigneeId: $taskAssigneeId
      turnedInAt: $turnedInAt
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
      turnedInAt
      assigneeURL {
        photoURL
      }
    }
  }
`;

const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
    }
  }
`;

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    {
      title,
      status,
      summary,
      type,
      priority,
      dueDate,
      startDate,
      taskAssigneeEmail,
      projectId,
      taskCreatorId,
      turnedInAt,
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await client.mutate({
        mutation: CREATE_TASK_MUTATION,
        variables: {
          title,
          status,
          summary,
          type,
          priority,
          dueDate,
          startDate,
          taskAssigneeEmail,
          projectId,
          taskCreatorId,
          turnedInAt,
        },
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
        projectId: createdTask.projectId,
        taskCreatorId: createdTask.taskCreatorId,
        turnedInAt: createdTask.turnedInAt,
        assigneeURL: createdTask.assigneeURL,
      };

      return formattedTask;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    {
      taskId,
      title,
      status,
      summary,
      type,
      priority,
      dueDate,
      startDate,
      taskAssigneeId,
      turnedInAt,
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await client.mutate({
        mutation: UPDATE_TASK_MUTATION,
        variables: {
          taskId,
          title,
          status,
          summary,
          type,
          priority,
          dueDate,
          startDate,
          taskAssigneeId,
          turnedInAt,
        },
      });

      const { data } = request;

      return data?.updateTask;
    } catch (error) {
      // Handle error
      console.error("Task Updation Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_TASK_MUTATION,
        variables: { taskId },
      });

      const { data } = request;
      return data.deleteTask;
    } catch (error) {
      // Handle error
      console.error("Task Deletion Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

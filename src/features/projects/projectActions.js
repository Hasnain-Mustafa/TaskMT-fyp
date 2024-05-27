import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../ApolloClient"; // Import your GraphQL client instance
import { gql } from "@apollo/client";

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject(
    $title: String
    $status: String
    $summary: String
    $weeks: Int
    $budget: Int
    $assigneeEmails: [String]
    $creatorId: ID
  ) {
    createProject(
      title: $title
      status: $status
      summary: $summary
      weeks: $weeks
      budget: $budget
      assigneeEmails: $assigneeEmails
      creatorId: $creatorId
    ) {
      id
      title
      status
      summary
      weeks
      budget
      assigneeIds
      creatorId
    }
  }
`;

const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject(
    $projectId: ID!
    $title: String
    $summary: String
    $weeks: Int
    $budget: Int
  ) {
    updateProject(
      projectId: $projectId
      title: $title
      summary: $summary
      weeks: $weeks
      budget: $budget
    ) {
      status
      summary
      weeks
      id
      assigneeIds
      title
      budget
      creatorId
    }
  }
`;

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId) {
      id
    }
  }
`;

const DELETE_PROJECTS_MUTATION = gql`
  mutation DeleteProjects($projectIds: [ID!]!) {
    deleteProjects(projectIds: $projectIds) {
      ids
    }
  }
`;

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (
    { title, status, summary, weeks, budget, assigneeEmails, creatorId },
    { rejectWithValue }
  ) => {
    try {
      const request = await client.mutate({
        mutation: CREATE_PROJECT_MUTATION,
        variables: {
          title,
          status,
          summary,
          weeks,
          budget,
          assigneeEmails,
          creatorId,
        },
      });

      const { data } = request;
      return data.createProject;
    } catch (error) {
      // Handle error
      console.error("Project Creation Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, title, summary, weeks, budget }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: UPDATE_PROJECT_MUTATION,
        variables: {
          projectId,
          title,

          summary,
          weeks,
          budget,
        },
      });

      const { data } = request;

      return data.updateProject;
    } catch (error) {
      // Handle error
      console.error("Project Updation Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_PROJECT_MUTATION,
        variables: { projectId },
      });

      const { data } = request;
      return data.deleteProject;
    } catch (error) {
      // Handle error
      console.error("Project Deletion Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjects = createAsyncThunk(
  "projects/deleteProjects",
  async ({ projectIds }, { rejectWithValue }) => {
    try {
      const request = await client.mutate({
        mutation: DELETE_PROJECTS_MUTATION,
        variables: { projectIds },
      });

      const { data } = request;
      return data.deleteProjects.ids; // Ensure this matches the data returned by your GraphQL server
    } catch (error) {
      console.error("Projects Deletion Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchProjectTasks = async (projectId, taskAssigneeId) => {
  const query = `
    query GetAssignedTasks($projectId: String!, $taskAssigneeId: String!) {
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
        turnedInAt
      }
    }
  `;

  try {
    const response = await fetch("https://taskmt-server.fly.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add other headers as needed, like authorization tokens
      },
      body: JSON.stringify({
        query: query,
        variables: {
          projectId: projectId,
          taskAssigneeId: taskAssigneeId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.getAssignedTasks;
  } catch (error) {
    console.error("Fetching tasks failed:", error);
    return []; // Return empty array or handle error as needed
  }
};

import { createSlice } from "@reduxjs/toolkit";

import {
  createProject,
  deleteProject,
  updateProject,
  deleteProjects,
} from "./projectActions";

const initialState = {
  projects: [],
  projectStats: {
    totalProjects: 0,
    tasksCompleted: 0,
    projectsInProgress: 0,
    projectsCompleted: 0,
    projectsStopped: 0,
  },
  loading: false,
  error: null,
  success: false,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjectStats: (state, action) => {
      state.projectStats = action.payload;
    },
    clearProjects: (state) => {
      state.loading = false;
      state.projects = [];
      state.error = null;
    },
    setProjects: (state, { payload }) => {
      state.projects = payload;
    },
    setCredentials: (state, { payload }) => {
      // Filter out tasks that already exist in the state
      const newProjects = payload.filter(
        (newProject) =>
          !state.projects.some(
            (existingProject) => existingProject.id === newProject.id
          )
      );
      // Concatenate the filtered tasks with the existing tasks
      state.projects = [...state.projects, ...newProjects];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // // Assuming the action.payload contains the newly created project
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newProjects = state.projects.map((project) => {
          return project?.id === action.payload?.id ? action.payload : project;
        });

        state.projects = newProjects;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const idsToDelete = new Set(action.payload);
        console.log(idsToDelete); // 'payload' should be an array of project IDs
        state.projects = state.projects.filter(
          (project) => !idsToDelete.has(project.id)
        );
        console.log(state.projects);
      })

      .addCase(deleteProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload.id
        );
        // Assuming you have a way to remove the project from the projects array
        // You need to remove the project from the state based on the action.payload
      })

      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setCredentials, setProjects, clearProjects, setProjectStats } =
  projectSlice.actions;
export default projectSlice.reducer;

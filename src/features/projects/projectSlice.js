import { createSlice } from '@reduxjs/toolkit';
import { createProject, deleteProject, updateProject } from './projectActions';

const initialState = {
  projects: [],
  loading: false,
  error: null,
  success: false
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      // state.projects.push(action.payload)
      state.projects=payload
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
        // Assuming you have a way to update the project in the projects array
        // You need to update the project in the state based on the action.payload
      })
      .addCase(updateProject.rejected, (state, action) => {
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
        state.projects = state.projects.filter(project => project.id !== action.payload.id);
        // Assuming you have a way to remove the project from the projects array
        // You need to remove the project from the state based on the action.payload
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setCredentials} = projectSlice.actions
export default projectSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { createTask, deleteTask, updateTask } from './taskActions'; // Import updateTask action creator

const initialState = {
assignee:{},
  tasks: [],
  loading: false,
  error: null,
  success: false
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.tasks = payload;
    },
    setAssignee: (state, { payload }) => {
      state.assignee = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => { // Handle updateTask pending
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => { // Handle updateTask fulfilled
        state.loading = false;
        state.success = true;
        const updatedTask = action.payload; // Assuming the updated task is returned in the payload
        state.tasks = state.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)); // Update the task in the state
      })
      .addCase(updateTask.rejected, (state, action) => { // Handle updateTask rejected
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, setAssignee } = taskSlice.actions;
export default taskSlice.reducer;

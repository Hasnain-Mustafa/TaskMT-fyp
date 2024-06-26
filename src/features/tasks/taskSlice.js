import { createSlice } from "@reduxjs/toolkit";
import { createTask, deleteTask, updateTask } from "./taskActions"; // Import updateTask action creator

const initialState = {
  assignee: {},
  calendarData: [],
  barData: [],
  lineChartData: [],
  areaChartData: [],
  tasks: [],
  loading: false,
  error: null,
  success: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setCalendarData: (state, action) => {
      state.calendarData = action.payload;
    },
    setBarData: (state, action) => {
      state.barData = action.payload;
    },
    setLineChartData: (state, action) => {
      state.lineChartData = action.payload;
    },
    setAreaChartData: (state, action) => {
      state.areaChartData = action.payload;
    },

    updateTasks: (state, action) => {
      state.tasks = action.payload;
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
        console.log(action.payload);
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        // Handle updateTask pending
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newTasks = state.tasks.map((task) => {
          return task?.id === action.payload?.id ? action.payload : task;
        });

        state.tasks = newTasks;
      })
      .addCase(updateTask.rejected, (state, action) => {
        // Handle updateTask rejected
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
        state.tasks = state.tasks.filter(
          (task) => task?.id !== action.payload?.id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAssignee,
  updateTasks,
  setCalendarData,
  setBarData,
  setLineChartData,
  setAreaChartData,
} = taskSlice.actions;
export default taskSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import { authApi } from "./services/auth/authService";
import { projectsApi } from "./services/projects/projectsService"; // Import the projectsApi
import taskReducer from "../features/tasks/taskSlice";
import { tasksApi } from "./services/tasks/tasksService";

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    [authApi.reducerPath]: authApi.reducer, // Assign unique reducerPath for authApi
    [projectsApi.reducerPath]: projectsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectsApi.middleware,
      tasksApi.middleware
    ), // Include projectsApi.middleware
});

export default store;

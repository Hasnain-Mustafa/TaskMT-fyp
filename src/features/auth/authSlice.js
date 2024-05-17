import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  userLogin,
  OAuthLogin,
  updatePicture,
  pushNotifications,
  deleteGoals,
  addGoals,
  updateGoals,
  chatNotifications,
  deleteChats,
  deleteNotifications,
} from "./authActions";

const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;
// const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const initialState = {
  loading: false,
  userInfo: null,
  userToken, // for storing the JWT
  notifications: [],
  showBadge: false,
  showDot: false,
  chats: [],
  goals: [],
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetNotifications: (state, { payload }) => {
      state.showDot = payload;
    },
    reset: (state, { payload }) => {
      state.showBadge = payload;
    },
    setChats: (state, { payload }) => {
      state.chats = [];
      // state.showBadge = true;
      state.chats = payload;
      console.log(payload);
    },
    setNotifications: (state, { payload }) => {
      state.notifications = [];
      state.notifications = payload;
    },
    setGoals: (state, { payload }) => {
      state.goals = payload;
      console.log(payload);
    },
    logout: (state) => {
      localStorage.removeItem("userToken"); // deletes token from storage
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },

    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
    },
    // setCredentials: (state, { payload }) => {
    //   if (payload.userInfo) {
    //     state.userInfo = payload.userInfo;
    //   }
    //   if (payload.userToken) {
    //     state.userToken = payload.userToken;
    //     localStorage.setItem('userToken', state.userToken); // Save token to localStorage
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;

        state.userInfo = action.payload;
        state.userToken = action.payload.userToken;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Update Picture URL
      .addCase(updatePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePicture.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.userInfo = {
          ...state.userInfo,
          photoURL: action.payload.photoURL,
        };
      })
      .addCase(updatePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //OAuth Login
      .addCase(OAuthLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OAuthLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.userToken = action.payload.userToken;
      })
      .addCase(OAuthLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pushNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pushNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = [];
      })
      .addCase(pushNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(chatNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chatNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = [];
      })
      .addCase(chatNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = state.chats.filter(
          (chat) => chat.userId !== action.payload.userId
        );
      })
      .addCase(deleteChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification.userId !== action.payload.userId
        );
      })
      .addCase(deleteNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = state.goals.filter(
          (goal) => goal.id !== action.payload.id
        );
      })
      .addCase(deleteGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload);
      })
      .addCase(addGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoals.fulfilled, (state, action) => {
        state.loading = false;
        const newGoals = state.goals.map((goal) => {
          return goal?.id === action.payload?.id ? action.payload : goal;
        });

        state.tasks = newGoals;
      })
      .addCase(updateGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // Registration successful
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  setCredentials,
  getUserDetails,
  setNotifications,
  setGoals,
  setChats,
  reset,
  resetNotifications,
} = authSlice.actions;
export default authSlice.reducer;

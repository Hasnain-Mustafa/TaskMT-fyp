import { createSlice } from '@reduxjs/toolkit';
import { registerUser, userLogin } from './authActions';

const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null

const initialState = {
  loading: false,
  userInfo: null, // for user object
  userToken, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:  {
    logout: (state) => {
      localStorage.removeItem('userToken') // deletes token from storage
      state.loading = false
      state.userInfo = null
      state.userToken = null
      state.error = null
    },
  
    setCredentials: (state, { payload }) => {
      state.userInfo = payload
      
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
      })

  },
});

export const { logout, setCredentials, getUserDetails } = authSlice.actions
export default authSlice.reducer;

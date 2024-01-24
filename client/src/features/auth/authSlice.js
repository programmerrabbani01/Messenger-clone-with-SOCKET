import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  forgotPassword,
  getLoggedInUser,
  loginUser,
  logoutUser,
  resendActivation,
  resetPassword,
  uploadUserProfilePhoto,
  verifyUserByOTP,
  verifyUserByURL,
} from "./authApiSlice";

// create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
    setLogout: (state) => {
      state.message = null;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // user create
      .addCase(createUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      // verify By OTP
      .addCase(verifyUserByOTP.pending, (state) => {
        state.loader = true;
      })
      .addCase(verifyUserByOTP.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(verifyUserByOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
        state.user = action.payload.user;
      })
      // verify By URL
      .addCase(verifyUserByURL.pending, (state) => {
        state.loader = true;
      })
      .addCase(verifyUserByURL.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(verifyUserByURL.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
        state.user = action.payload.user;
      })
      // resend activation request
      .addCase(resendActivation.pending, (state) => {
        state.loader = true;
      })
      .addCase(resendActivation.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(resendActivation.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loader = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loader = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
      })
      // login
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // log out
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.user = null;
        localStorage.removeItem("user");
      })
      // logged in user
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.user = null;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // user photo upload
      .addCase(uploadUserProfilePhoto.pending, (state) => {
        state.loader = true;
      })
      .addCase(uploadUserProfilePhoto.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(uploadUserProfilePhoto.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loader = false;
        state.user = action.payload.user;
      });
  },
});

// selectors

export const getAuthData = (state) => state.auth;

// actions

export const { setMessageEmpty, setLogout } = authSlice.actions;

// export

export default authSlice.reducer;

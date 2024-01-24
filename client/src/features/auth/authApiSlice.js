import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// register user
export const createUser = createAsyncThunk("auth/createUser", async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5050/api/v1/auth/register",
      data,
      {
        withCredentials: true,
      }
    );

    // const response = await axios.post(
    //   "http://localhost:5050/api/v1/auth/register",
    //   data.input,
    //   {
    //     withCredentials: true,
    //   }
    // );

    // data.resetForm();

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// verify User By OTP
export const verifyUserByOTP = createAsyncThunk(
  "auth/verifyUserByOTP",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/verifyByOTP/${data.token}`,
        { otp: data.otp },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// verify User By URL
export const verifyUserByURL = createAsyncThunk(
  "auth/verifyUserByURL",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/verifyByURL/${data}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// resend activation
export const resendActivation = createAsyncThunk(
  "auth/resendActivation",
  async (auth) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/auth/resendVerificationCode/${auth}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/resetPass/${data.token}`,
        data.input,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/forgotPassReset`,
        data,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5050/api/v1/auth/login",
      data,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// LogOut user
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await axios.post(
      "http://localhost:5050/api/v1/auth/logout",
      "",
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// LoggedIn User
export const getLoggedInUser = createAsyncThunk(
  "auth/getLoggedInUser",
  async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/v1/auth/me", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

//  Upload Profile Photo
export const uploadUserProfilePhoto = createAsyncThunk(
  "auth/uploadUserProfilePhoto",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/profilePhotoUpload/${data.id}`,
        data.data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // get All chat

export const getUserToUserChats = createAsyncThunk(
  "chat/getUserToUserChats",
  async (data) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/chat/${data}`,
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

// create a chat

export const createChats = createAsyncThunk(
  "chat/createChats",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/chat`,
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

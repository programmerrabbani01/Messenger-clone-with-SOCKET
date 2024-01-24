import { createSlice } from "@reduxjs/toolkit";
import { createChats, getUserToUserChats } from "./chatApiSlice.js";

// create auth slice
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: null,
    error: null,
    message: null,
    chatSuccess: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.chatSuccess = false;
    },
    realTimeChatUpdate: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserToUserChats.fulfilled, (state, action) => {
        state.chats = action.payload.chat;
      })
      .addCase(createChats.fulfilled, (state, action) => {
        state.chats = [...state.chats, action.payload.chat];
        state.chatSuccess = action.payload.chat;
      });
  },
});

// selectors
export const getAllChatsData = (state) => state.chat;
// actions
export const { setMessageEmpty, realTimeChatUpdate } = chatSlice.actions;

// export
export default chatSlice.reducer;

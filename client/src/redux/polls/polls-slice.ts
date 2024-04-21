import { createSlice } from "@reduxjs/toolkit";

import { createPollThunk, joinPollThunk } from "./polls-operations";

import { Poll } from "shared/poll-types";

interface PollsSlice {
  token: string;
  poll: Poll | null;
  isAdmin?: boolean;
  isLoading: boolean;
  error: null | unknown;
}

const initialState: PollsSlice = {
  token: "",
  poll: null,
  isAdmin: false,
  isLoading: false,
  error: null,
};

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPollThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = "";
        state.isAdmin = false;
      })
      .addCase(createPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.data.accessToken;
        state.poll = action.payload.data.poll;
        state.isAdmin = true;
      })
      .addCase(createPollThunk.rejected, (state, action: any) => {
        state.error = action.payload.error;
        state.isLoading = false;
        state.isAdmin = false;
      })

      .addCase(joinPollThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = "";
        state.isAdmin = false;
      })
      .addCase(joinPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.data.accessToken;
        state.poll = action.payload.data.poll;
        state.isAdmin = false;
      })
      .addCase(joinPollThunk.rejected, (state, action: any) => {
        state.error = action.payload.error;
        state.isLoading = false;
        state.isAdmin = false;
      });
  },
});

export const pollsReducer = pollsSlice.reducer;

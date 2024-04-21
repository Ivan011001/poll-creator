import { createSlice } from "@reduxjs/toolkit";

import { createPollThunk } from "./polls-operations";

interface PollsSlice {
  name: string;
  token: string;
  isLoading: boolean;
  error: string | unknown;
}

const initialState: PollsSlice = {
  name: "",
  token: "",
  isLoading: false,
  error: "",
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
      })
      .addCase(createPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createPollThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const pollsReducer = pollsSlice.reducer;

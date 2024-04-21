import { createSlice } from "@reduxjs/toolkit";

interface AuthSlice {
  name: string;
  token: string;
}

const initialState: AuthSlice = {
  name: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const authReducer = authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICounterSlice {
  value: number;
}

const initialState: ICounterSlice = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },

    decrement(state, action: PayloadAction<number>) {
      state.value -= action.payload;
    },
  },
});

export const { decrement, increment } = counterSlice.actions;

export const counterReducer = counterSlice.reducer;

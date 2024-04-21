import { RootState } from "../store";

export const selectUsername = (state: RootState) => state.polls.name;

export const selectToken = (state: RootState) => state.polls.token;

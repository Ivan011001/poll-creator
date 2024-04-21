import { RootState } from "../store";

export const selectAuthName = (state: RootState) => state.auth.name;

export const selectAuthToken = (state: RootState) => state.auth.token;

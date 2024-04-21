import { createAsyncThunk } from "@reduxjs/toolkit";

import { makeRequest } from "@/api";

import * as z from "zod";
import { createPollSchema, joinPollSchema } from "@/schemas";

import { type Poll } from "shared/poll-types";

export const createPollThunk = createAsyncThunk(
  "polls/create",
  async (values: z.infer<typeof createPollSchema>, { rejectWithValue }) => {
    try {
      const validatedFields = createPollSchema.safeParse(values);

      if (!validatedFields.success) {
        return rejectWithValue("Invalid fields");
      }

      const { name, topic, maxVotes } = values;

      const response = await makeRequest<{
        poll: Poll;
        accessToken: string;
      }>("/polls/", {
        method: "POST",
        body: JSON.stringify({
          topic,
          votesPerVoter: maxVotes,
          name,
        }),
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const joinPollThunk = createAsyncThunk(
  "polls/join",
  async (values: z.infer<typeof joinPollSchema>, { rejectWithValue }) => {
    try {
      const validatedFields = joinPollSchema.safeParse(values);

      if (!validatedFields.success) {
        return rejectWithValue("Invalid fields");
      }

      const { name, code } = validatedFields.data;

      const response = await makeRequest<{
        poll: Poll;
        accessToken: string;
      }>("/polls/join", {
        method: "POST",
        body: JSON.stringify({
          pollID: code,
          name,
        }),
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

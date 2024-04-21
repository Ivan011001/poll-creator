import { createAsyncThunk } from "@reduxjs/toolkit";

import { makeRequest } from "@/api";

import * as z from "zod";
import { createPollSchema } from "@/schemas";

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

      const { data, error } = await makeRequest<{
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
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

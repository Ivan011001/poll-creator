import * as z from "zod";

export const joinPollSchema = z.object({
  name: z.string().min(2).max(50),
  pollID: z.string(),
});

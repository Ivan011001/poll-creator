import * as z from "zod";

export const createPollSchema = z.object({
  topic: z.string().min(2).max(200),
  maxVotes: z.number(),
  name: z.string().min(2).max(50),
});

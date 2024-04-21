import * as z from "zod";

export const joinPollSchema = z.object({
  name: z.string().min(2).max(50),
  code: z
    .string()
    .min(6, {
      message: "Code must be 6 digits long",
    })
    .transform((value) => value.toUpperCase()),
});

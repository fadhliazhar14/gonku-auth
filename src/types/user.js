import { z } from "zod";

export const userSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()).optional()
});
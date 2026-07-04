import { z } from "zod";

export const UserDetailsSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be between 3 and 50 characters")
    .max(50, "Username must be between 3 and 50 characters"),
  name: z
    .string()
    .min(1, "Nama is required")
    .min(3, "Name must be between 3 and 50 characters")
    .max(50, "Name must be between 3 and 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(100, "Email must not exceed 100 characters")
    .email("Email is not in valid format"),
  password: z.string().optional()
});

export const UserDetailsModel = {
  initialValues: {
    username: "",
    name: "",
    email: ""
  }
};

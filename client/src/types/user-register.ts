import { z } from "zod";

const RegisterFormSchema = z.object({
  username: z.string().refine((name) => name.trim().length > 0, {
    message: "Username is required",
  }),
  email: z.string().email({ message: "Enter email in proper format" }),
  password: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
      ),
      {
        message:
          "Minimum 8 characters, at least one letter, one number and one special character",
      },
    ),
});

type RegisterForm = z.infer<typeof RegisterFormSchema>;

export type { RegisterForm };
export default RegisterFormSchema;

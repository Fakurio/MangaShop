import { z } from "zod";

const RegisterSchema = z.object({
  username: z.string().refine((name) => name.trim().length > 0, {
    message: "Username is required",
  }),
  email: z.string().email({ message: "Enter email in proper format" }),
  password: z
    .object({
      value: z
        .string()
        .regex(
          new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
          ),
          {
            message:
              "Minimum 8 characters, at least one letter, one number and one special character",
          }
        ),
      confirm: z
        .string()
        .regex(
          new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
          ),
          {
            message:
              "Minimum 8 characters, at least one letter, one number and one special character",
          }
        ),
    })
    .refine((password) => password.value === password.confirm, {
      message: "Passwords don't match",
    }),
});

type RegisterUser = z.infer<typeof RegisterSchema>;

type RegisterError = {
  username: string;
  email: string;
  password: string;
};

export type { RegisterUser, RegisterError };
export default RegisterSchema;

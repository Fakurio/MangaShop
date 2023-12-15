import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Enter email in proper format" }),
  password: z.string(),
});

type LoginUser = z.infer<typeof LoginSchema>;

type LoginError = {
  email: string;
  password: string;
};

export type { LoginUser, LoginError };
export default LoginSchema;

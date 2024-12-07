import { z } from "zod";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Enter email in proper format" }),
  password: z.string(),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

export type { LoginForm };
export default LoginFormSchema;

import { z } from 'zod';

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginUserDto = z.infer<typeof LoginUserSchema>;

export type { LoginUserDto };
export default LoginUserSchema;

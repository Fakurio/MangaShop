import { z } from 'zod';

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  cart: z
    .array(z.object({ manga_id: z.number(), quantity: z.number() }))
    .optional(),
});

type LoginUserDto = z.infer<typeof LoginUserSchema>;

export type { LoginUserDto };
export default LoginUserSchema;

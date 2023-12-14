import { z } from 'zod';

const RegisterUserSchema = z.object({
  username: z.string().refine((name) => name.trim().length > 0),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',
      ),
    ),
});

type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export type { RegisterUserDto };
export default RegisterUserSchema;

import { z } from 'zod';

export const CreateCartSchema = z.object({
  status: z.string(),
  manga_id: z.string(),
  quantity: z.string(),
});

export type CreateCartDto = z.infer<typeof CreateCartSchema>;

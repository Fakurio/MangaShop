import { z } from 'zod';

export const createOrderSchema = z.object({
  cart: z.array(z.object({ manga_id: z.number(), quantity: z.number() })),
  payment_method: z.string(),
  total: z.number(),
});

export type CreateOrderT = z.infer<typeof createOrderSchema>;

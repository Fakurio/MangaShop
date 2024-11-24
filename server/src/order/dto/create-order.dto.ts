import { z } from 'zod';

export const createOrderSchema = z.object({
  cart: z.array(z.object({ manga_id: z.number().int(), quantity: z.number().int() })),
  payment_method: z.string(),
  total: z.number(),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

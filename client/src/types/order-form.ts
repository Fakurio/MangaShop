import { z } from "zod";

const OrderFormSchema = z.object({
  payment_method: z.string().refine((name) => name.trim().length > 0, {
    message: "Payment method is required",
  }),
});

type OrderForm = z.infer<typeof OrderFormSchema>;

export default OrderFormSchema;
export type { OrderForm };

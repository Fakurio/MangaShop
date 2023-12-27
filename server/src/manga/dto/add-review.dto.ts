import { z } from 'zod';

const addReviewDtoSchema = z.object({
  content: z.string().min(1).max(1000),
  rating: z.number().int().min(0).max(5),
  manga_id: z.number().int(),
  created_at: z.coerce.date(),
});

type addReviewDto = z.infer<typeof addReviewDtoSchema>;

export { addReviewDtoSchema, addReviewDto };

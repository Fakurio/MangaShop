import { z } from "zod";

const ReviewFormSchema = z.object({
  content: z.string().refine((name) => name.trim().length > 0, {
    message: "Review content in required",
  }),
  rating: z.number().min(1).max(5),
});

type ReviewForm = z.infer<typeof ReviewFormSchema>;

export type { ReviewForm };
export default ReviewFormSchema;

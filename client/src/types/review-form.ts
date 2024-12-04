import { z } from "zod";

const ReviewFormSchema = z.object({
  content: z.string().refine((name) => name.trim().length > 0, {
    message: "Review content is required",
  }),
  rating: z.string().refine((rating) => {
    const ratingNumber = parseInt(rating);
    return ratingNumber >= 1 && ratingNumber <= 5;
  }),
});

type ReviewForm = z.infer<typeof ReviewFormSchema>;

export type { ReviewForm };
export default ReviewFormSchema;

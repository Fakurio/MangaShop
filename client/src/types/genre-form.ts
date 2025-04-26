import { z } from "zod";

const genreFormSchema = z.object({
  name: z.string().refine(
    (title) => {
      const trimValue = title.trim();
      return trimValue.length > 0 && trimValue.length <= 20;
    },
    { message: "Name must be between 1 and 20 characters" },
  ),
});

type GenreForm = z.infer<typeof genreFormSchema>;
type GenreFormErrors = {
  [k in keyof GenreForm]?: string;
};

export { genreFormSchema };
export type { GenreForm, GenreFormErrors };

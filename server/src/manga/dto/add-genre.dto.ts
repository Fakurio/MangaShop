import { z } from 'zod';

const genreDTOSchema = z.object({
  name: z.string().refine(
    (title) => {
      const trimValue = title.trim();
      return trimValue.length > 0 && trimValue.length <= 20;
    },
    { message: 'Name must be between 1 and 20 characters' },
  ),
});

type GenreDTO = z.infer<typeof genreDTOSchema>;

export type { GenreDTO };
export default genreDTOSchema;

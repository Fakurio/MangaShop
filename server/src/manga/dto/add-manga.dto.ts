import { z } from 'zod';

const addMangaDtoSchema = z.object({
  title: z.string().refine(
    (title) => {
      const trimValue = title.trim();
      return trimValue.length > 0 && trimValue.length <= 50;
    },
    { message: 'Title must be between 1 and 50 characters' },
  ),
  img_url: z.string().refine((url) => url.trim().length > 0, {
    message: 'Image URL must not be empty',
  }),
  price: z.string().refine(
    (price) => {
      const regex = /^(?!0\d)(\d{1,3})(\.\d{1,2})?$/;
      if (!regex.test(price)) {
        return false;
      }
      const floatValue = parseFloat(price);
      if (isNaN(floatValue) || floatValue <= 0) {
        return false;
      }
      return true;
    },
    {
      message: 'Price must be a positive number up to 999.99',
    },
  ),
  stock_quantity: z
    .number()
    .int({ message: 'Stock quantity must be integer' })
    .min(0, { message: 'Stock quantity must be at least 0' }),
  author: z.string().refine(
    (author) => {
      const trimValue = author.trim();
      return trimValue.length > 0 && trimValue.length <= 50;
    },
    { message: 'Author must be between 1 and 50 characters' },
  ),
  description: z.string().refine(
    (description) => {
      const trimValue = description.trim();
      return trimValue.length > 0 && trimValue.length <= 5000;
    },
    { message: 'Description must be between 1 and 5000 characters' },
  ),
  genres: z
    .array(
      z.string().refine((genre) => genre.trim().length > 0, {
        message: 'Genre name must not be empty',
      }),
    )
    .min(1, { message: 'At least one genre must be provided' }),
});

type AddMangaDTO = z.infer<typeof addMangaDtoSchema>;

export { addMangaDtoSchema };
export type { AddMangaDTO };

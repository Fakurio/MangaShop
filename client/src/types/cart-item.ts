export type CartItem = {
  manga_id: number;
  quantity: number;
};

export type CartItemDisplay = {
  manga_id: number | undefined;
  title: string | undefined;
  logo: string | undefined;
  price: number | undefined;
  quantity: number;
};

<script lang="ts">
  import type { OrderItem } from "../types/order-item";
  import {fetchMangas, mangaStore} from "../stores/manga.store";
  import { get } from "svelte/store";
  import { formatDate } from "../utils/formatDate";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import type {Manga} from "../types/manga";

  interface OrderItemProps {
    status: string;
    date: Date;
    total: string | number;
    orderItems: OrderItem[];
  }

  type OrderItemManga = Pick<Manga, "manga_id" | "img_url" | "price" | "title"> & {
    quantity: number;
  }

  const {status, date, total, orderItems} : OrderItemProps = $props()

  let orderItemsMangas = $state<OrderItemManga[]>([])

  const prepareContent = async () => {
    await fetchMangas()
    orderItems.forEach(orderItem => {
      const foundManga = get(mangaStore).find(manga => manga.manga_id === orderItem.manga_id)
      if(foundManga) {
        orderItemsMangas.push({...foundManga, quantity: orderItem.quantity})
      }
    })
  }
</script>

{#await prepareContent()}
  <Skeleton class="h-[100px] border border-card-foreground w-full"/>
{:then _}
    <Accordion.Item value={orderItems[0].order_id.toString()} class="rounded-md p-4 border-2 border-border">
        <Accordion.Trigger class="p-0 hover:no-underline">
            <div class="flex flex-wrap gap-10">
                <div class="flex flex-col justify-evenly items-start gap-4">
                    <p>
                        Status: <span class="text-primary font-bold">{status}</span>
                    </p>
                    <p>
                        Order value: <span class="text-primary font-bold">{total} PLN</span>
                    </p>
                    <p>
                        Order date: <span class="text-primary font-bold">{formatDate(date)}</span>
                    </p>
                </div>
                <div class="flex flex-wrap gap-5">
                    {#each orderItemsMangas as manga (manga.manga_id)}
                        <div>
                            <img src={manga.img_url} alt={manga.title} class="w-[100px] h-[150px]"/>
                        </div>
                    {/each}
                </div>
            </div>
        </Accordion.Trigger>
        <Accordion.Content>
            <div class="mt-8 flex flex-col gap-5 text-[1.1rem]">
                {#each orderItemsMangas as manga (manga.manga_id)}
                    <div class="border-border border-2 rounded-xl p-4 flex justify-between items-center max-[500px]:flex-col max-[500px]:gap-4">
                        <img src={manga.img_url} alt={manga.title} class="w-[100px] h-[150px]"/>
                        <p>Quantity: {manga.quantity}</p>
                        <p>Price: {manga.price} PLN</p>
                    </div>
                {/each}
            </div>
        </Accordion.Content>
    </Accordion.Item>
{/await}


<script lang="ts">
  import { getTotalValue } from "../stores/cart.store";
  import cartStore from "../stores/cart.store";
  import {derived} from "svelte/store";
  import {fetchPaymentMethods, createOrder} from "../stores/order.store";
  import {toast} from "svelte-sonner";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import * as Select from "$lib/components/ui/select";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import {Button} from "$lib/components/ui/button";
  import OrderFormSchema, {type OrderForm} from "../types/order-form";
  import {getErrorsFromZod} from "../utils/getErrorsFromZod";


  const totalValue = derived(cartStore, _ => {
    return getTotalValue()
  })
  let orderForm = $state<OrderForm>({
    payment_method: "",
  });
  let orderFormErrors = $state<Partial<OrderForm>>({
    payment_method: "",
  })

  const handleCreatingOrder = async () => {
    const parsedOrder = OrderFormSchema.safeParse(orderForm)
    const errors = getErrorsFromZod(parsedOrder)
    if(errors) {
      orderFormErrors = errors;
    } else {
      const [isError, message] = await createOrder(orderForm.payment_method, $totalValue);
      if (isError) {
        console.log("Order summary: ", message);
        toast.error("Failed to create order")
      } else {
        toast.success("Order created successfully");
      }
    }
  }

  const cleanErrors = () => {
    orderFormErrors = {
      payment_method: "",
    }
  }
</script>

{#await fetchPaymentMethods()}
  <Skeleton class="h-[300px] border border-card-foreground w-full lg:w-[300px]"/>
{:then paymentMethods}
  <div class="border-2 border-border w-full min-[1200px]:max-w-[350px] p-6 rounded-3xl">
    <h1 class="font-bold text-xl">Order Summary</h1>
    <Select.Root type="single" bind:value={orderForm.payment_method}>
      <Select.Trigger class="mt-4" id="payment-method" onclick={cleanErrors}>
        {orderForm.payment_method || "Select payment method"}
      </Select.Trigger>
      <Select.Content>
        {#each paymentMethods as method (method.payment_method_id)}
          <Select.Item value={method.name}>{method.name}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    {#if orderFormErrors.payment_method}
      <Alert.Root class="mt-4 p-3" variant="destructive">
        <Alert.Title>{orderFormErrors.payment_method}</Alert.Title>
      </Alert.Root>
    {/if}
    <h2 class="mt-4 text-lg">Order total: {$totalValue} PLN</h2>
    <Button onclick={handleCreatingOrder} class="mt-4">Checkout</Button>
  </div>
{/await}


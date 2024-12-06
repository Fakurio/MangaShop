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


  const totalValue = derived(cartStore, _ => {
    return getTotalValue()
  })
  let paymentMethod = $state<string>("");
  let formError = $state<boolean>(false)

  const handleCreatingOrder = async () => {
    if(!paymentMethod) {
      formError = true
      return
    }
    const [isError, message] = await createOrder(paymentMethod, $totalValue);
    if (isError) {
      console.log("Order: ", message);
      toast.error("Failed to create order")
    } else {
      toast.success("Order created successfully");
    }
  }
</script>

{#await fetchPaymentMethods()}
  <Skeleton class="h-[300px] border border-card-foreground w-full lg:w-[300px]"/>
{:then paymentMethods}
  <div class="border-2 border-border w-full min-[1200px]:max-w-[350px] p-6 rounded-3xl">
    <h1 class="font-bold text-xl">Order Summary</h1>
    <Select.Root type="single" bind:value={paymentMethod}>
      <Select.Trigger class="mt-4" id="payment-method" onclick={() => formError = false}>
        {paymentMethod || "Select payment method"}
      </Select.Trigger>
      <Select.Content>
        {#each paymentMethods as method (method.payment_method_id)}
          <Select.Item value={method.name}>{method.name}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    {#if formError}
      <Alert.Root class="mt-4 p-3" variant="destructive">
        <Alert.Title>Payment method is required</Alert.Title>
      </Alert.Root>
    {/if}
    <h2 class="mt-4 text-lg">Order total: {$totalValue} PLN</h2>
    <Button onclick={handleCreatingOrder} class="mt-4">Checkout</Button>
  </div>
{/await}


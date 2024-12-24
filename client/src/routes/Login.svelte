<script lang="ts">
  import Header from "../components/Header.svelte";
  import type { LoginForm } from "../types/user-login";
  import LoginFormSchema from "../types/user-login";
  import { login, authStore } from "../stores/auth.store";
  import cartStore from "../stores/cart.store";
  import { get } from "svelte/store";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button";
  import { getErrorsFromZod } from "../utils/getErrorsFromZod";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { pop, replace } from "svelte-spa-router";

  let loginForm = $state<LoginForm>({
    password: "",
    email: "",
  });
  let loginFormErrors = $state<Partial<LoginForm>>({
    password: "",
    email: "",
  });

  const cleanErrors = () => {
    loginFormErrors = {
      email: "",
      password: "",
    };
  };

  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedLoginForm = LoginFormSchema.safeParse(loginForm);
    const errors = getErrorsFromZod(parsedLoginForm);
    if (errors) {
      loginFormErrors = errors;
    } else {
      try {
        await login(loginForm, get(cartStore));
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  onMount(() => {
    const isLoggedIn = $authStore !== null;
    if (isLoggedIn) {
      replace("/");
    }
  });
</script>

<Header />
<main class="flex justify-center items-center mt-4 p-4">
  <form
    class="flex flex-col border-border border-2 rounded-3xl bg-card p-8 w-full max-w-[400px]"
    onsubmit={(e) => handleFormSubmit(e)}
  >
    <h1 class="text-center text-4xl font-bold">Login</h1>
    <div class="mt-6">
      <Label for="email">Email</Label>
      <Input
        class="mt-2"
        id="email"
        bind:value={loginForm.email}
        onclick={cleanErrors}
        required
      />
      {#if loginFormErrors.email}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{loginFormErrors.email}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
    <div class="mt-6">
      <Label for="password">Password</Label>
      <Input
        class="mt-2"
        id="password"
        type="password"
        bind:value={loginForm.password}
        onclick={cleanErrors}
        required
      />
      {#if loginFormErrors.password}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{loginFormErrors.password}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
    <Button type="submit" class="mt-6">Login</Button>
  </form>
</main>
<Toaster
  theme="dark"
  toastOptions={{
    classes: {
      toast: "border-2 text-lg",
    },
  }}
/>

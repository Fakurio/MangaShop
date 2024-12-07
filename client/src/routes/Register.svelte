<script lang="ts">
  import Header from "../components/Header.svelte";
  import type { RegisterForm } from "../types/user-register";
  import RegisterFormSchema from "../types/user-register";
  import {getErrorsFromZod} from "../utils/getErrorsFromZod";
  import {register} from "../stores/auth.store";
  import {toast} from "svelte-sonner";
  import {Toaster} from "$lib/components/ui/sonner";
  import {Label} from "$lib/components/ui/label";
  import {Input} from "$lib/components/ui/input/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import {Button} from "$lib/components/ui/button";

  let registerForm = $state<RegisterForm> ({
    username: "",
    password: "",
    email: "",
  });
  let registerFormErrors = $state<Partial<RegisterForm>>({
    username: "",
    password: "",
    email: "",
  });

  const cleanErrors = () => {
    registerFormErrors = {
      username: "",
      password: "",
      email: "",
    }
  };

  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedRegisterForm = RegisterFormSchema.safeParse(registerForm);
    const errors = getErrorsFromZod(parsedRegisterForm)
    if(errors) {
      registerFormErrors = errors;
    } else {
      try {
        const data = await register(registerForm);
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  };
</script>


<Header />
<main class="flex justify-center items-center mt-4 p-4">
  <form class="flex flex-col border-border border-2 rounded-3xl bg-card p-8 w-full max-w-[400px]" onsubmit={(e) => handleFormSubmit(e)}>
    <h1 class="text-center text-4xl font-bold">Register</h1>
    <div class="mt-6">
      <Label for="username">Username</Label>
      <Input class="mt-2" id="username" bind:value={registerForm.username} onclick={cleanErrors} required />
      {#if registerFormErrors.username}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{registerFormErrors.username}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
    <div class="mt-6">
      <Label for="email">Email</Label>
      <Input class="mt-2" id="email" bind:value={registerForm.email} onclick={cleanErrors} required />
      {#if registerFormErrors.email}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{registerFormErrors.email}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
    <div class="mt-6">
      <Label for="password">Password</Label>
      <Input class="mt-2" id="password" type="password" bind:value={registerForm.password} onclick={cleanErrors} required />
      {#if registerFormErrors.password}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{registerFormErrors.password}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
    <Button type="submit" class="mt-6">Register</Button>
  </form>
</main>
<Toaster theme="dark" toastOptions={{
  classes: {
    toast: "border-2 text-lg",
}}}/>


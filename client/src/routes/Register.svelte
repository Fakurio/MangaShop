<script lang="ts">
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import type { RegisterUser, RegisterError } from "../types/user-register";
  import RegisterSchema from "../types/user-register";
  import { fromZodError } from "zod-validation-error";

  const cleanErrors = {
    username: "",
    password: "",
    email: "",
  };

  let user: RegisterUser = {
    username: "",
    password: "",
    email: "",
  };

  let errors: RegisterError = cleanErrors;
  let serverResponse: string = "";
  let isServerError: boolean = false;

  const resetErrors = () => {
    errors = cleanErrors;
  };

  const handleFormSubmit = async () => {
    let parsedUser = RegisterSchema.safeParse(user);
    if (!parsedUser.success) {
      fromZodError(parsedUser.error).details.forEach((error) => {
        switch (error.path.join("")) {
          case "email": {
            errors = { ...errors, email: error.message };
            break;
          }
          case "username": {
            errors = { ...errors, username: error.message };
            break;
          }
          case "password": {
            errors = { ...errors, password: error.message };
            break;
          }
        }
      });
    } else {
      serverResponse = "";
      isServerError = false;
      try {
        let response = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          let err = await response.json();
          throw new Error(err.message);
        }
        let msg = await response.json();
        serverResponse = msg.message;
      } catch (e: any) {
        serverResponse = e.message;
        isServerError = true;
      }
    }
  };
</script>

{#if serverResponse}
  <p
    class={`server-response ${
      isServerError ? "server-response--error" : undefined
    }`}
  >
    {serverResponse}
  </p>
{/if}
<Header />
<main>
  <form class="register-form" on:submit|preventDefault={handleFormSubmit}>
    <h1 class="register-form__heading">Register</h1>
    <div class="register-form__field">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        bind:value={user.username}
        on:input={() => resetErrors()}
        required
      />
      {#if errors.username}
        <span class="error">{errors.username}</span>
      {/if}
    </div>
    <div class="register-form__field">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={user.email}
        on:input={() => resetErrors()}
        required
      />
      {#if errors.email}
        <span class="error">{errors.email}</span>
      {/if}
    </div>
    <div class="register-form__field">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        bind:value={user.password}
        on:input={() => resetErrors()}
        required
      />
      {#if errors.password}
        <span class="error">{errors.password}</span>
      {/if}
    </div>
    <Button text="Register" />
  </form>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 5rem;
    padding: 1rem;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    color: white;
    max-width: 400px;
    width: 100%;
    background-color: #282628;
    padding: 2rem;
    border-radius: 0.5rem;
    gap: 2rem;
  }

  .register-form__heading {
    text-align: center;
    font-size: 2.5rem;
  }

  .register-form__field {
    display: flex;
    flex-direction: column;
  }

  .register-form__field input {
    background-color: #383638;
    border: none;
    padding: 0.5rem;
    color: white;
    font-size: 1rem;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
  }

  .register-form__field label {
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>

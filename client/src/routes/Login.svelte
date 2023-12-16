<script lang="ts">
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import type { LoginError, LoginUser } from "../types/user-login";
  import LoginSchema from "../types/user-login";
  import { fromZodError } from "zod-validation-error";
  import { login } from "../stores/auth.store";

  const cleanErrors = {
    password: "",
    email: "",
  };

  let user: LoginUser = {
    password: "",
    email: "",
  };

  let errors: LoginError = cleanErrors;
  let serverResponse: string = "";
  let isServerError: boolean = false;

  const resetErrors = () => {
    errors = cleanErrors;
  };

  const handleFormSubmit = async () => {
    let parsedUser = LoginSchema.safeParse(user);
    if (!parsedUser.success) {
      fromZodError(parsedUser.error).details.forEach((error) => {
        switch (error.path.join("")) {
          case "email": {
            errors = { ...errors, email: error.message };
            break;
          }
        }
      });
    } else {
      serverResponse = "";
      isServerError = false;
      try {
        await login(user);
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
  <form class="login-form" on:submit|preventDefault={handleFormSubmit}>
    <h1 class="login-form__heading">Login</h1>
    <div class="login-form__field">
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
    <div class="login-form__field">
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
    <Button text="Login" />
  </form>
</main>

<style>
  .server-response {
    background-color: green;
    color: white;
    padding: 1rem;
    font-weight: 700;
    font-size: 1.3rem;
    text-align: center;
    animation:
      slideIn 0.3s ease-in-out,
      slideOut 0.3s ease-in-out 2s forwards;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .server-response--error {
    background-color: rgb(197, 40, 40);
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }

  main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 3rem;
    padding: 1rem;
  }

  .login-form {
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

  .login-form__heading {
    text-align: center;
    font-size: 2.5rem;
  }

  .login-form__field {
    display: flex;
    flex-direction: column;
  }

  .login-form__field input {
    background-color: #383638;
    border: none;
    padding: 0.5rem;
    color: white;
    font-size: 1rem;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
  }

  .login-form__field label {
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>

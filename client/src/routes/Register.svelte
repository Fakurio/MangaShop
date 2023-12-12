<script lang="ts">
  import Button from "../components/Button.svelte";
</script>

<main>
  <form class="register-form">
    <h1 class="register-form__heading">Register</h1>
    <div class="register-form__field">
      <label for="username">Username</label>
      <input id="username" type="text" />
    </div>
    <div class="register-form__field">
      <label for="email">Email</label>
      <input id="email" type="text" />
    </div>
    <div class="register-form__field">
      <label for="password">Password</label>
      <input id="password" type="password" />
    </div>
    <div class="register-form__field">
      <label for="conf-password">Confirm Password</label>
      <input id="conf-password" type="password" />
    </div>
    <Button text="Register" />
  </form>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding-inline: 1rem;
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
    font-weight: 300;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
  }

  .register-form__field label {
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>

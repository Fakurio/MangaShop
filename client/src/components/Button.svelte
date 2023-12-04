<script lang="ts">
  export let text: string;
</script>

<button type="submit">{text}</button>

<style>
  button {
    margin-top: 2rem;
    background-color: #e58e27;
    border: none;
    padding: 0.6em 0.3em;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 1rem;
    cursor: pointer;
  }
</style>

<script lang="ts">
  export let text: string;
  export let className = "";
  export let onClick: () => void = () => {};
</script>

<button type="submit" class={className} on:click={onClick}>{text}</button>

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
    color: #383638;
  }

  button:hover {
    color: #e58e27;
    background-color: #323133;
  }
</style>

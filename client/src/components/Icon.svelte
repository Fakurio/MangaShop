<script lang="ts">
  export let type: string;
  export let onClick: () => void = () => {};
  export let className = "";
</script>

<button on:click={onClick} class={className}>
  <img src="../{type}.svg" alt="{type} icon" class="icon" />
</button>

<style>
  .icon {
    width: 20px;
    height: 20px;
    filter: invert(52%) sepia(0%) saturate(1541%) hue-rotate(36deg)
      brightness(85%) contrast(85%);
    cursor: pointer;
    position: relative;
  }
</style>

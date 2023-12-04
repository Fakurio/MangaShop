<script lang="ts">
  export let type: string;
</script>

<img src="../../public/{type}.svg" alt="{type} icon" class="icon" />

<style>
  .icon {
    width: 20px;
    height: 20px;
    filter: invert(52%) sepia(0%) saturate(1541%) hue-rotate(36deg)
      brightness(85%) contrast(85%);
  }
</style>

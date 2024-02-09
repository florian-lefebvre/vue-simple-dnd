<script setup lang="ts">
import { provideDragContext } from "../composables/provide-drag-context";

provideDragContext();
</script>

<template>
  <slot />
</template>

<script setup lang="ts">
import { provideDragContext } from "../composables/provide-drag-context.js";

provideDragContext();
</script>

<template>
  <slot />
</template>

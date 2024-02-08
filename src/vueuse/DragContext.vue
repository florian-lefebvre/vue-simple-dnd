<script setup lang="ts">
import { ref } from "vue";
import { createDragContext } from "./context";

createDragContext({ elementDragged: ref(null) });
</script>

<template>
  <slot />
</template>

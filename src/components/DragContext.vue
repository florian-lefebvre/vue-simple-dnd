<script setup lang="ts">
import { createDragContext } from "../lib/context";
import { useDragMachine } from "../composables/use-drag-machine";

const data = useDragMachine()
createDragContext(data);
</script>

<template>
  <slot />
</template>

<script setup lang="ts">
import { createDragContext } from "./context";
import { useDragMachine } from "./use-drag-machine";

const data = useDragMachine()
createDragContext(data);
</script>

<template>
  <slot />
</template>

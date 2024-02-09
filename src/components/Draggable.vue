<script setup lang="ts">
import { ref } from "vue";
import { useDraggable } from "../composables/use-draggable";

const props = defineProps<{
  data: any;
  fallbackClass?: string;
}>();

const el = ref<HTMLElement | null>(null);
const { dragging, style } = useDraggable({ el, data: props.data });
</script>

<template>
  <div ref="el" class="simple-draggable-draggable" :style="style">
    <slot v-bind="{ dragging }" />
  </div>
  <div v-if="dragging" :class="['simple-draggable-draggable', fallbackClass]">
    <slot v-bind="{ dragging }" />
  </div>
</template>

<style>
.simple-draggable-draggable * {
  user-select: none;
}
</style>

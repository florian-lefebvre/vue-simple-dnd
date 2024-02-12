<script setup lang="ts">
import { ref } from "vue";
import { useDraggable } from "../composables/use-draggable.js";

const props = defineProps<{
  data: any;
  fallbackClass?: string;
}>();

const el = ref<HTMLElement | null>(null);
const { dragging, style } = useDraggable({ el, data: props.data });
</script>

<template>
  <div ref="el" class="vue-simple-dnd-draggable" :style="style">
    <slot v-bind="{ dragging }" />
  </div>
  <div v-if="dragging" :class="['vue-simple-dnd-draggable', fallbackClass]">
    <slot v-bind="{ dragging }" />
  </div>
</template>

<style>
.vue-simple-dnd-draggable * {
  user-select: none;
}
</style>

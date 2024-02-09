<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useDraggable, useElementBounding } from "@vueuse/core";
import { useDragContext } from "../lib/context";
import { useBoundingDimensions } from "../composables/use-bounding-dimensions";

const props = defineProps<{
  data: any;
  fallbackClass?: string;
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const dimensions = useBoundingDimensions(bounding)
const { isDragging, style, position } = useDraggable(el);
const { machine } = useDragContext();

const updateDraggingPosition = () => {
  position.value = { x: bounding.x.value, y: bounding.y.value };
};

onMounted(() => {
  updateDraggingPosition();
});

watch(isDragging, (value) => {
  if (value) {
    machine.send({
      type: "startDragging",
      draggable: {
        dimensions: dimensions.value,
        data: props.data,
      },
    });
  } else {
    machine.send({ type: "stopDragging" });
    nextTick(() => {
      updateDraggingPosition();
    });
  }
});

watch([bounding.x, bounding.y], () => {
  machine.send({
    type: "updateDraggable",
    draggable: {
      dimensions: dimensions.value,
      data: props.data,
    },
  });
});
</script>

<template>
  <div
    ref="el"
    class="simple-draggable-draggable"
    :style="
      isDragging
        ? `position:fixed;z-index:9999;${style};cursor:grabbing`
        : 'cursor:grab'
    "
  >
    <slot v-bind="{ dragging: isDragging }" />
  </div>
  <div v-if="isDragging" :class="['simple-draggable-draggable', fallbackClass]">
    <slot v-bind="{ dragging: isDragging }" />
  </div>
</template>

<style>
.simple-draggable-draggable * {
  user-select: none;
}
</style>

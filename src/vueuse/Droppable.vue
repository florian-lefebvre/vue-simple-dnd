<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDragContext } from "./context";
import { useElementBounding, usePrevious } from "@vueuse/core";

const emit = defineEmits<{
  drop: [data: any];
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const context = useDragContext();
const previousElementDragged = usePrevious(context.elementDragged);

const isDragging = computed(() => !!context.elementDragged.value);
const hasOverlap = computed(() => {
  if (!isDragging.value) return false;
  const { left, top, right, bottom } = context.elementDragged.value!.bounding;

  return !(
    bounding.left.value > right ||
    bounding.right.value < left ||
    bounding.top.value > bottom ||
    bounding.bottom.value < top
  );
});
const isHovered = computed(() => isDragging.value && hasOverlap.value);

watch([isDragging, hasOverlap], ([isDragging, isMouseOverEl]) => {
  if (!isDragging && isMouseOverEl) {
    emit("drop", previousElementDragged.value!.data);
  }
});
</script>

<template>
  <div ref="el">
    <slot v-bind="{ hovered: isHovered }" />
  </div>
</template>

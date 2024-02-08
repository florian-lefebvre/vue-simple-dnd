<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDragContext } from "./context";
import { useElementBounding } from "@vueuse/core";
import { useId } from "./use-id";

const emit = defineEmits<{
  drop: [data: any];
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const { machine, bus } = useDragContext();
const id = useId();

const isDragging = computed(() => machine.snapshot.value.matches("dragging"));
const hasOverlap = computed(() => {
  if (!isDragging.value) return false;
  const [left, top, right, bottom] =
    machine.snapshot.value.context.draggable!.dimensions;

  return !(
    bounding.left.value > right ||
    bounding.right.value < left ||
    bounding.top.value > bottom ||
    bounding.bottom.value < top
  );
});
const isHovered = computed(() => isDragging.value && hasOverlap.value);

watch(isHovered, (isHovered) => {
  if (isHovered) {
    machine.send({
      type: "updateDroppable",
      droppable: {
        id,
        dimensions: [
          bounding.left.value,
          bounding.top.value,
          bounding.right.value,
          bounding.bottom.value,
        ] as const,
      },
    });
  } else {
    machine.send({ type: "removeDroppable", id });
  }
});

bus.on((event, payload) => {
  if (event === "drop-id" && payload?.id === id) {
    emit("drop", payload.data);
  }
});
</script>

<template>
  <div ref="el">
    <slot
      v-bind="{
        hovered: machine.snapshot.value.context.biggestDroppableId === id,
      }"
    />
  </div>
</template>

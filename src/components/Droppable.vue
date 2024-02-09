<script setup lang="ts">
import { type ComputedRef, computed, ref, watch } from "vue";
import { useDragContext } from "../lib/context";
import { useElementBounding } from "@vueuse/core";
import { useId } from "../composables/use-id";
import type { Dimensions } from "../types";
import { useBoundingDimensions } from "../composables/use-bounding-dimensions";

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const emit = defineEmits<{
  drop: [data: any];
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const { machine, bus } = useDragContext();
const id = useId();

bus.on((event, payload) => {
  if (event === "drop-id" && payload?.id === id) {
    emit("drop", payload.data);
  }
});

const dimensions = useBoundingDimensions(bounding);
const slotProps = useSlotProps({
  dimensions,
  snapshot: machine.snapshot,
  id,
  onHoverChange(hovered) {
    if (hovered) {
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
  },
});

function useSlotProps({
  dimensions,
  snapshot,
  onHoverChange,
  id,
}: {
  dimensions: ComputedRef<Dimensions>;
  snapshot: ReturnType<typeof useDragContext>["machine"]["snapshot"];
  onHoverChange: (hovered: boolean) => void;
  id: string;
}) {
  const isDragging = computed(() => snapshot.value.matches("dragging"));
  const hasOverlap = computed(() => {
    if (!isDragging.value) return false;

    const x1 = dimensions.value;
    const x2 = snapshot.value.context.draggable!.dimensions;

    return !(x1[0] > x2[2] || x1[2] < x2[0] || x1[1] > x2[3] || x1[3] < x2[1]);
  });
  const isHovered = computed(() => isDragging.value && hasOverlap.value);
  const isNotAllowed = computed(() =>
    props.disabled ? isHovered.value : false
  );

  watch(isHovered, (hovered) => {
    if (props.disabled) {
      return;
    }

    onHoverChange(hovered);
  });

  const isCurrentDroppableHovered = computed(
    () => machine.snapshot.value.context.biggestDroppableId === id
  );

  return computed(() => ({
    hovered: isCurrentDroppableHovered.value,
    notAllowed: isNotAllowed.value,
  }));
}
</script>

<template>
  <div ref="el">
    <slot v-bind="slotProps" />
  </div>
</template>

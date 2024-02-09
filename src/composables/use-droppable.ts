import { type ComputedRef, computed, watch, type Ref } from "vue";
import { useDragContext } from "../internal/lib/context";
import { useElementBounding } from "@vueuse/core";
import { useId } from "../internal/composables/use-id";
import type { Dimensions } from "../types";
import { useBoundingDimensions } from "../internal/composables/use-bounding-dimensions";

export const useDroppable = ({
  el,
  onDrop,
  disabled = false,
}: {
  el: Ref<HTMLElement | null>;
  onDrop: (data: any) => void;
  disabled?: boolean;
}) => {
  const bounding = useElementBounding(el);
  const { machine, bus } = useDragContext();
  const id = useId();

  bus.on((event, payload) => {
    if (event === "drop-id" && payload?.id === id) {
      onDrop(payload.data);
    }
  });

  const dimensions = useBoundingDimensions(bounding);
  const slotProps = useSlotProps({
    dimensions,
    snapshot: machine.snapshot,
    id,
    disabled,
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

  return { slotProps };
};

const useSlotProps = ({
  dimensions,
  snapshot,
  onHoverChange,
  id,
  disabled,
}: {
  dimensions: ComputedRef<Dimensions>;
  snapshot: ReturnType<typeof useDragContext>["machine"]["snapshot"];
  onHoverChange: (hovered: boolean) => void;
  id: string;
  disabled: boolean;
}) => {
  const isDragging = computed(() => snapshot.value.matches("dragging"));
  const hasOverlap = computed(() => {
    if (!isDragging.value) return false;

    const x1 = dimensions.value;
    const x2 = snapshot.value.context.draggable!.dimensions;

    return !(x1[0] > x2[2] || x1[2] < x2[0] || x1[1] > x2[3] || x1[3] < x2[1]);
  });
  const isHovered = computed(() => isDragging.value && hasOverlap.value);
  const isNotAllowed = computed(() => (disabled ? isHovered.value : false));

  watch(isHovered, (hovered) => {
    if (disabled) {
      return;
    }

    onHoverChange(hovered);
  });

  const isCurrentDroppableHovered = computed(
    () => snapshot.value.context.biggestDroppableId === id
  );

  return computed(() => ({
    hovered: isCurrentDroppableHovered.value,
    notAllowed: isNotAllowed.value,
  }));
};

import { computed, watch, type ComputedRef, type Ref } from "vue";
import { useBoundingDimensions } from "../internal/composables/use-bounding-dimensions.js";
import { useElementBounding } from "../internal/composables/use-element-bounding.js";
import { useId } from "../internal/composables/use-id.js";
import { useDragContext } from "../internal/lib/drag-context.js";
import { createDroppableContext } from "../internal/lib/droppable-context.js";
import type { Dimensions, Droppable } from "../types.js";

export const useDroppable = ({
  el,
  onDrop,
  disabled = computed(() => false),
  acceptSelfDraggables = computed(() => true),
  overlap = computed(() => 0.001),
}: {
  /**
   * A reference to the element acting as the droppable.
   */
  el: Ref<HTMLElement | null>;
  /**
   * When a draggable is dropped on {el}, this function is
   * called with the `data` passed to the dropped draggable.
   */
  onDrop: (data: any) => void;
  /**
   * When disabled, this composable won't trigger `onDrop`.
   * However, the slot prop `notAllowed` will be `true`.
   *
   * @default `false`
   */
  disabled?: ComputedRef<boolean>;
  /**
   * When enabled, dragging a Draggable from this droppable
   * over itself will trigger `dragging`.
   *
   * @default `true`
   */
  acceptSelfDraggables?: ComputedRef<boolean>;
  /**
   * Defines how much overlap between the droppable and the
   * draggable is required to trigger a hover.
   *
   * @default `0.001`
   */
  overlap?: ComputedRef<number>;
}) => {
  const bounding = useElementBounding(el);
  const { machine, bus } = useDragContext();
  const id = useId();

  createDroppableContext({ id });

  bus.on((event, payload) => {
    if (event === "drop-id" && payload?.id === id) {
      onDrop(payload.data);
    }
  });

  const dimensions = useBoundingDimensions(bounding);

  const droppable = computed<Droppable>(() => ({
    id,
    dimensions: dimensions.value,
  }));

  const slotProps = useSlotProps({
    dimensions,
    snapshot: machine.snapshot,
    id,
    disabled,
    percentage: overlap,
    onHoverChange(hovered) {
      if (
        !acceptSelfDraggables.value &&
        machine.snapshot.value.context.draggable?.droppableId === id
      ) {
        return;
      }

      if (hovered) {
        machine.send({
          type: "updateDroppable",
          droppable: droppable.value,
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
  percentage,
}: {
  dimensions: ComputedRef<Dimensions>;
  snapshot: ReturnType<typeof useDragContext>["machine"]["snapshot"];
  onHoverChange: (hovered: boolean) => void;
  id: string;
  disabled: ComputedRef<boolean>;
  percentage: ComputedRef<number>;
}) => {
  const isDragging = computed(() => snapshot.value.matches("dragging"));
  const hasOverlap = computed(() => {
    if (!isDragging.value) return false;

    const x1 = dimensions.value;
    const x2 = snapshot.value.context.draggable!.dimensions;

    const overlapX = Math.max(
      0,
      Math.min(x1[2], x2[2]) - Math.max(x1[0], x2[0])
    );
    const overlapY = Math.max(
      0,
      Math.min(x1[3], x2[3]) - Math.max(x1[1], x2[1])
    );
    const overlapArea = overlapX * overlapY;

    const draggableArea = (x2[2] - x2[0]) * (x2[3] - x2[1]);

    return overlapArea >= percentage.value * draggableArea;
  });
  const isHovered = computed(() => isDragging.value && hasOverlap.value);
  const isNotAllowed = computed(() =>
    disabled.value ? isHovered.value : false
  );

  watch(isHovered, (hovered) => {
    if (disabled.value) {
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

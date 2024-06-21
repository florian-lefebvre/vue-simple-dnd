import {
  nextTick,
  onMounted,
  watch,
  type Ref,
  computed,
  type ComputedRef,
} from "vue";
import {
  useDraggable as _useDraggable,
  useElementBounding,
} from "@vueuse/core";
import { useDragContext } from "../internal/lib/drag-context.js";
import { useBoundingDimensions } from "../internal/composables/use-bounding-dimensions.js";
import { useDroppableContext } from "../internal/lib/droppable-context.js";
import { Draggable } from "../types.js";

export const useDraggable = <T>({
  el,
  data,
  disabled = computed(() => false),
}: {
  /**
   * A reference to the element acting as the draggable.
   */
  el: Ref<HTMLElement | null>;
  /**
   * Pass any data that you want to get back in `useDroppable` `onDrop`.
   */
  data: Ref<T>;
  /**
   * When disabled, `dragging` will always be false.
   *
   * @default `false`
   */
  disabled?: ComputedRef<boolean>;
}) => {
  const bounding = useElementBounding(el);
  const dimensions = useBoundingDimensions(bounding);
  const {
    isDragging: _isDragging,
    style: _style,
    position,
  } = _useDraggable(el);
  const { machine } = useDragContext();
  const droppable = useDroppableContext();

  const isDragging = computed(() => !disabled.value && _isDragging.value);

  const draggable = computed<Draggable>(() => ({
    dimensions: dimensions.value,
    data: data.value,
    droppableId: droppable.id,
  }));

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
        draggable: draggable.value,
      });
    } else {
      machine.send({ type: "stopDragging" });
      nextTick(() => {
        // TODO: check if needed
        updateDraggingPosition();
      });
    }
  });

  watch([bounding.x, bounding.y], () => {
    updateDraggingPosition();
    machine.send({
      type: "updateDraggable",
      draggable: draggable.value,
    });
  });

  return {
    dragging: isDragging,
    style: computed(() =>
      isDragging.value
        ? `touch-action:none;position:fixed;z-index:9999;${_style.value};cursor:grabbing;`
        : disabled.value
        ? "touch-action:none;"
        : "touch-action:none;cursor:grab;"
    ),
  };
};

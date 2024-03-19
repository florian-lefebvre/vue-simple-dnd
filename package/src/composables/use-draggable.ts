import { nextTick, onMounted, watch, type Ref, computed } from "vue";
import {
  useDraggable as _useDraggable,
  useElementBounding,
} from "@vueuse/core";
import { useDragContext } from "../internal/lib/drag-context.js";
import { useBoundingDimensions } from "../internal/composables/use-bounding-dimensions.js";
import { useDroppableContext } from "../internal/lib/droppable-context.js";
import { Draggable } from "../types.js";

export const useDraggable = ({
  el,
  data,
}: {
  /**
   * A reference to the element acting as the draggable.
   */
  el: Ref<HTMLElement | null>;
  /**
   * Pass any data that you want to get back in `useDroppable` `onDrop`.
   */
  data: any;
}) => {
  const bounding = useElementBounding(el);
  const dimensions = useBoundingDimensions(bounding);
  const { isDragging, style: _style, position } = _useDraggable(el);
  const { machine } = useDragContext();
  const droppable = useDroppableContext();

  const draggable = computed<Draggable>(() => ({
    dimensions: dimensions.value,
    data,
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
        updateDraggingPosition();
      });
    }
  });

  watch([bounding.x, bounding.y], () => {
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
        : "touch-action:none;cursor:grab;"
    ),
  };
};

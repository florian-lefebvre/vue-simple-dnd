import { nextTick, onMounted, watch, type Ref, computed } from "vue";
import {
  useDraggable as _useDraggable,
  useElementBounding,
} from "@vueuse/core";
import { useDragContext } from "../internal/lib/context.js";
import { useBoundingDimensions } from "../internal/composables/use-bounding-dimensions.js";

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
          data,
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
        data,
      },
    });
  });

  return {
    dragging: isDragging,
    style: computed(() =>
      isDragging.value
        ? `position:fixed;z-index:9999;${_style.value};cursor:grabbing`
        : "cursor:grab"
    ),
  };
};
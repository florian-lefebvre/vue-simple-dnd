import { computed } from "vue";
import { useDragMachine } from "../internal/composables/use-drag-machine.js";
import { useEdgeScroll } from "../internal/composables/use-edge-scroll.js";
import { createDragContext } from "../internal/lib/drag-context.js";

export const provideDragContext = () => {
  const data = useDragMachine();
  createDragContext(data);
  useEdgeScroll({
    edgeSize: 100,
    enabled: computed(() => !!data.machine.snapshot.value.context.draggable),
  });
};

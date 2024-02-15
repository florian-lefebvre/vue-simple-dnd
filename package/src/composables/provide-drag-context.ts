import { useDragMachine } from "../internal/composables/use-drag-machine.js";
import { createDragContext } from "../internal/lib/drag-context.js";

export const provideDragContext = () => {
  const data = useDragMachine();
  createDragContext(data);
};

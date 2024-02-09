import { useDragMachine } from "../internal/composables/use-drag-machine";
import { createDragContext } from "../internal/lib/context";

export const provideDragContext = () => {
  const data = useDragMachine();
  createDragContext(data);
};

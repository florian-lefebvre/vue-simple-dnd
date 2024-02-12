import { useMachine } from "@xstate/vue";
import { dragMachine } from "../lib/machine.js";
import { useEventBus } from "@vueuse/core";

export const useDragMachine = () => {
  const bus = useEventBus<"drop-id", { id: string; data: any }>(
    "simple-draggable"
  );

  const machine = useMachine(dragMachine, {
    input: {
      notify(payload) {
        bus.emit("drop-id", payload);
      },
    },
  });

  return { machine, bus };
};

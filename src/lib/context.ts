import { inject, provide, type InjectionKey } from "vue";
import { useDragMachine } from "./use-drag-machine";

type Context = ReturnType<typeof useDragMachine>

const contextKey = Symbol() as InjectionKey<Context>;

export const createDragContext = (context: Context) => {
  provide(contextKey, context);
};

export const useDragContext = () => {
  const context = inject(contextKey);

  if (!context) {
    throw new Error("Couldn't find a drag context");
  }

  return context;
};

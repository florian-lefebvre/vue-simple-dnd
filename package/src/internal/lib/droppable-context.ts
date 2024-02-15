import { inject, provide, type InjectionKey } from "vue";
import { Droppable } from "../../types.js";

type Context = {
  id: Droppable["id"]
}

const contextKey = Symbol() as InjectionKey<Context>;

export const createDroppableContext = (context: Context) => {
  provide(contextKey, context);
};

export const useDroppableContext = () => {
  const context = inject(contextKey);

  if (!context) {
    throw new Error("Couldn't find a droppable context");
  }

  return context;
};

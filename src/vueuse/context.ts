import { inject, provide, type InjectionKey, Ref } from "vue";

type Context = {
  elementDragged: Ref<null | {
    el: HTMLElement;
    bounding: { top: number; left: number; right: number; bottom: number};
    data: any;
  }>;
};

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

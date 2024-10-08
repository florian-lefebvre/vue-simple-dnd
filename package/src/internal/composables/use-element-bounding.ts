import {
  unrefElement,
  useEventListener,
  useMutationObserver,
  useRafFn,
  useResizeObserver,
  type MaybeComputedElementRef,
} from "@vueuse/core";
import { nextTick, onMounted, ref, watch } from "vue";

// Source: https://github.com/vueuse/vueuse/blob/main/packages/core/useElementBounding/index.ts
export function useElementBounding(target: MaybeComputedElementRef) {
  const height = ref(0);
  const bottom = ref(0);
  const left = ref(0);
  const right = ref(0);
  const top = ref(0);
  const width = ref(0);
  const x = ref(0);
  const y = ref(0);

  function update() {
    const el = unrefElement(target);

    if (!el) {
      height.value = 0;
      bottom.value = 0;
      left.value = 0;
      right.value = 0;
      top.value = 0;
      width.value = 0;
      x.value = 0;
      y.value = 0;
      return;
    }

    const rect = el.getBoundingClientRect();

    height.value = rect.height;
    bottom.value = rect.bottom;
    left.value = rect.left;
    right.value = rect.right;
    top.value = rect.top;
    width.value = rect.width;
    x.value = rect.x;
    y.value = rect.y;
  }

  useResizeObserver(target, update);
  watch(
    () => unrefElement(target),
    (ele) => !ele && update()
  );
  // trigger by css or style
  useMutationObserver(target, update, {
    attributeFilter: ["style", "class"],
  });

  useRafFn(update, {
    fpsLimit: 10,
  });

  useEventListener("scroll", update, { capture: true, passive: true });
  useEventListener("resize", update, { passive: true });

  onMounted(() => {
    // This is the fix
    nextTick(() => {
      update();
    });
  });

  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    update,
  };
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>;

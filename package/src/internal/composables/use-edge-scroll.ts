import { useEventListener, useWindowSize } from "@vueuse/core";
import { ComputedRef, computed, onMounted } from "vue";

// https://www.bennadel.com/blog/3460-automatically-scroll-the-window-when-the-user-approaches-the-viewport-edge-in-javascript.htm
export const useEdgeScroll = ({
  edgeSize = 200,
  enabled = computed(() => true),
}: { edgeSize?: number; enabled?: ComputedRef<boolean> } = {}) => {
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();

  onMounted(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    const handler = (viewportX: number, viewportY: number) => {
      if (!enabled.value) {
        return false;
      }

      const edgeTop = edgeSize;
      const edgeLeft = edgeSize;
      const edgeBottom = viewportHeight.value - edgeSize;
      const edgeRight = viewportWidth.value - edgeSize;

      const isInLeftEdge = viewportX < edgeLeft;
      const isInRightEdge = viewportX > edgeRight;
      const isInTopEdge = viewportY < edgeTop;
      const isInBottomEdge = viewportY > edgeBottom;

      if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
        clearTimeout(timer);
        return;
      }

      const documentWidth = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.body.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.body.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );

      const maxScrollX = documentWidth - viewportWidth.value;
      const maxScrollY = documentHeight - viewportHeight.value;

      (function checkForWindowScroll() {
        clearTimeout(timer);

        if (adjustWindowScroll()) {
          timer = setTimeout(checkForWindowScroll, 30);
        }
      })();

      function adjustWindowScroll() {
        const currentScrollX = window.scrollX;
        const currentScrollY = window.scrollY;

        const canScrollUp = currentScrollY > 0;
        const canScrollDown = currentScrollY < maxScrollY;
        const canScrollLeft = currentScrollX > 0;
        const canScrollRight = currentScrollX < maxScrollX;

        let nextScrollX = currentScrollX;
        let nextScrollY = currentScrollY;

        const maxStep = 50;

        // Should we scroll left?
        if (isInLeftEdge && canScrollLeft) {
          const intensity = (edgeLeft - viewportX) / edgeSize;

          nextScrollX = nextScrollX - maxStep * intensity;

          // Should we scroll right?
        } else if (isInRightEdge && canScrollRight) {
          const intensity = (viewportX - edgeRight) / edgeSize;

          nextScrollX = nextScrollX + maxStep * intensity;
        }

        // Should we scroll up?
        if (isInTopEdge && canScrollUp) {
          const intensity = (edgeTop - viewportY) / edgeSize;

          nextScrollY = nextScrollY - maxStep * intensity;

          // Should we scroll down?
        } else if (isInBottomEdge && canScrollDown) {
          const intensity = (viewportY - edgeBottom) / edgeSize;

          nextScrollY = nextScrollY + maxStep * intensity;
        }

        nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
        nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

        if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
          window.scrollTo(nextScrollX, nextScrollY);
          return true;
        } else {
          return false;
        }
      }
    };

    useEventListener(
      window,
      "mousemove",
      (event) => handler(event.clientX, event.clientY),
      false
    );

    useEventListener(
      window,
      "touchmove",
      (event) => handler(event.touches[0].clientX, event.touches[0].clientY),
      false
    );
  });
};

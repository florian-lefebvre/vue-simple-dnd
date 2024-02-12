import { computed } from "vue";
import type { Dimensions } from "../../types.js";
import type { useElementBounding } from "@vueuse/core";

export const useBoundingDimensions = (
  bounding: ReturnType<typeof useElementBounding>
) => {
  return computed<Dimensions>(
    () =>
      [
        bounding.left.value,
        bounding.top.value,
        bounding.right.value,
        bounding.bottom.value,
      ] as const
  );
}

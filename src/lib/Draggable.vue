<script setup lang="ts">
import { nextTick, onMounted, ref, toRaw, watch } from "vue";
import { useDraggable, useElementBounding } from "@vueuse/core";
import { useDragContext } from "./context";

const props = defineProps<{
  data: any;
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const { isDragging, style, position } = useDraggable(el);
const { machine } = useDragContext();

onMounted(() => {
  position.value = { x: bounding.x.value, y: bounding.y.value };
});

watch(isDragging, (value) => {
  if (value) {
    machine.send({
      type: "startDragging",
      draggable: {
        dimensions: [
          bounding.left.value,
          bounding.top.value,
          bounding.right.value,
          bounding.bottom.value,
        ] as const,
        data: toRaw(props.data),
      },
    });
  } else {
    machine.send({ type: "stopDragging" });
    nextTick(() => {
      position.value = { x: bounding.x.value, y: bounding.y.value };
    });
  }
});

watch([bounding.x, bounding.y], () => {
  machine.send({
    type: "updateDraggable",
    draggable: {
      dimensions: [
        bounding.left.value,
        bounding.top.value,
        bounding.right.value,
        bounding.bottom.value,
      ] as const,
      data: toRaw(props.data),
    },
  });
});
</script>

<template>
  <div
    ref="el"
    class="temp"
    :style="isDragging ? `position:fixed;z-index:9999;${style}` : undefined"
  >
    <slot v-bind="{ dragging: isDragging }" />
  </div>
  <div
    v-if="isDragging"
    :style="`width:${bounding.width.value}px;height:${bounding.height.value}px`"
  ></div>
</template>

<style>
.temp * {
  user-select: none;
}
</style>

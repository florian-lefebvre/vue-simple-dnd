<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useDraggable, useElementBounding } from "@vueuse/core";
import { useDragContext } from "./context";

const props = defineProps<{
  data: any;
}>();

const el = ref<HTMLElement | null>(null);
const bounding = useElementBounding(el);
const { isDragging, style, position } = useDraggable(el);

const context = useDragContext();

onMounted(() => {
  position.value = { x: bounding.x.value, y: bounding.y.value };
});

watch(isDragging, (value) => {
  if (value) {
    context.elementDragged.value = {
      el: el.value!,
      bounding: {
        left: bounding.left.value,
        top: bounding.top.value,
        right: bounding.right.value,
        bottom: bounding.bottom.value,
      },
      data: props.data,
    };
  } else {
    context.elementDragged.value = null;
    nextTick(() => {
      position.value = { x: bounding.x.value, y: bounding.y.value };
    });
  }
});

watch([bounding.x, bounding.y], () => {
  if (context.elementDragged.value) {
    context.elementDragged.value = {
      ...context.elementDragged.value,
      bounding: {
        left: bounding.left.value,
        top: bounding.top.value,
        right: bounding.right.value,
        bottom: bounding.bottom.value,
      },
    };
  }
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

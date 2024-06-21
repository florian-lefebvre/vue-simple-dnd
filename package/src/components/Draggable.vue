<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";
import { useDraggable } from "../composables/use-draggable.js";
import { useElementBounding } from "@vueuse/core";

const emit = defineEmits<{
  dragStart: [data: T];
  dragEnd: [data: T];
}>();

const props = withDefaults(
  defineProps<{
    /**
     * Pass any data that you want to get back in `Droppable@drop`.
     */
    data: T;
    /**
     * When dragging, we create a copy of the default slot to make
     * sure there is no layout shift. Specify this option will add
     * the class to this fallback element.
     */
    fallbackClass?: string;
    /**
     * When disabled, the `dragging` slot prop will always be false.
     *
     * @default `false`
     */
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const el = ref<HTMLElement | null>(null);
const { dragging, style } = useDraggable({
  el: el as any,
  data: computed(() => props.data),
  disabled: computed(() => props.disabled),
});

const fallbackRef = ref<HTMLElement | null>(null);
const bounding = useElementBounding(fallbackRef as any);

watch(dragging, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    emit("dragStart", props.data);
  } else if (!newValue && oldValue) {
    emit("dragEnd", props.data);
  }
});
</script>

<template>
  <div
    ref="el"
    class="vue-simple-dnd-draggable"
    :style="
      dragging
        ? `${style}width:${bounding.width.value}px;height:${bounding.height.value}px;`
        : style
    "
  >
    <slot v-bind="{ dragging }" />
  </div>
  <div
    v-if="dragging"
    ref="fallbackRef"
    :class="['vue-simple-dnd-draggable', fallbackClass]"
  >
    <slot v-bind="{ dragging }" />
  </div>
</template>

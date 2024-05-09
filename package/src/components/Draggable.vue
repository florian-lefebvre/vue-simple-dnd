<script setup lang="ts">
import { ref, watch } from "vue";
import { useDraggable } from "../composables/use-draggable.js";
import { useElementBounding } from "@vueuse/core";

const emit = defineEmits(['dragStart', 'dragEnd'])

const props = defineProps<{
  /**
   * Pass any data that you want to get back in `Droppable@drop`.
   */
  data: any;
  /**
   * When dragging, we create a copy of the default slot to make
   * sure there is no layout shift. Specify this option will add
   * the class to this fallback element.
   */
  fallbackClass?: string;
}>();

const el = ref<HTMLElement | null>(null);
const { dragging, style } = useDraggable({ el: el as any, data: props.data });

const fallbackRef = ref<HTMLElement | null>(null);
const bounding = useElementBounding(fallbackRef as any);

watch(dragging, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    emit('dragStart', props.data);
  } else if (!newValue && oldValue) {
    emit('dragEnd', props.data);
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

<style>
.vue-simple-dnd-draggable * {
  user-select: none;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDroppable } from "../composables/use-droppable.js";

const props = withDefaults(
  defineProps<{
    /**
     * When disabled, this component won't trigger `@drop`.
     * However, the slot prop `notAllowed` will be `true`,
     * allowing you to apply styling.
     * 
     * @default `false`
     */
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  /**
   * When a `Draggable` is dropped on this component, this
   * event is emitted with the `data` passed to the dropped
   * `Draggable`.
   */
  drop: [data: any];
}>();

const el = ref<HTMLElement | null>(null);
const { slotProps } = useDroppable({
  el: el as any,
  disabled: computed(() => props.disabled),
  onDrop: (data) => emit("drop", data),
});
</script>

<template>
  <div ref="el">
    <slot v-bind="slotProps" />
  </div>
</template>

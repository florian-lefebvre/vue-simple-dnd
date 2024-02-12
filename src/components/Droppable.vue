<script setup lang="ts">
import { computed, ref } from "vue";
import { useDroppable } from "../composables/use-droppable";

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const emit = defineEmits<{
  drop: [data: any];
}>();

const el = ref<HTMLElement | null>(null);
const { slotProps } = useDroppable({
  el,
  disabled: computed(() => props.disabled),
  onDrop: (data) => emit("drop", data),
});
</script>

<template>
  <div ref="el">
    <slot v-bind="slotProps" />
  </div>
</template>

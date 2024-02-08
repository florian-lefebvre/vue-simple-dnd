<script setup lang="ts">
import { ref } from "vue";
import { Primitive } from "./Primitive";

const props = withDefaults(
  defineProps<{
    parse?: (item: string) => any;
    disabled?: boolean
  }>(),
  {
    parse: (item: string) => JSON.parse(item),
    disabled: false
  }
);

const emit = defineEmits<{
  drop: [item: any];
}>();

const hovered = ref(false);

const onDragEnter = () => {
  if (props.disabled) return;
  hovered.value = true;
};

const onDragOver = (e: DragEvent) => {
  if (props.disabled) return;
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
  return false;
};

const onDragLeave = () => {
  if (props.disabled) return;
  hovered.value = false;
};

const onDrop = (e: DragEvent) => {
  if (props.disabled) return;
  e.stopPropagation();
  hovered.value = false;

  if (e.dataTransfer) {
    const item = props.parse(e.dataTransfer.getData("item"));
    emit("drop", item);
  }
};
</script>

<template>
  <Primitive
    :data-hovered="hovered"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <slot v-bind="{ hovered }" />
  </Primitive>
</template>

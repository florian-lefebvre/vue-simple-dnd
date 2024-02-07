<script setup lang="ts">
import { computed, ref } from "vue";
import { Primitive } from "./Primitive";

const props = withDefaults(
  defineProps<{
    parse?: (item: string) => any;
    maxItems?: number;
    itemsCount?: number;
  }>(),
  {
    parse: (item: string) => JSON.parse(item),
  }
);

const emit = defineEmits<{
  drop: [item: any];
}>();

const hovered = ref(false);

const acceptsDraggable = computed(() =>
  props.maxItems ? (props.itemsCount ?? 0) < props.maxItems : true
);

const onDragEnter = () => {
  if (!acceptsDraggable.value) return;
  hovered.value = true;
};

const onDragOver = (e: DragEvent) => {
  if (!acceptsDraggable.value) return;
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
  return false;
};

const onDragLeave = () => {
  if (!acceptsDraggable.value) return;
  hovered.value = false;
};

const onDrop = (e: DragEvent) => {
  if (!acceptsDraggable.value) return;
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

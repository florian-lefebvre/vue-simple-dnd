<script setup lang="ts" generic="T">
import { ref } from "vue";
import { Primitive } from "./Primitive";

const props = withDefaults(
  defineProps<{
    item: T;
    serialize?: (item: T) => string;
  }>(),
  { serialize: (item: T) => JSON.stringify(item) }
);

const dragging = ref(false);

const onDragStart = (e: DragEvent) => {
  dragging.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", props.serialize(props.item as any));
  }
};

const onDragEnd = () => {
  dragging.value = false;
};
</script>

<template>
  <Primitive
    as-child
    draggable="true"
    :data-dragging="dragging"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <slot v-bind="{ dragging }" />
  </Primitive>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "vue-simple-dnd/css";
import { DragContext, Draggable, Droppable } from "vue-simple-dnd";

type Item = {
  id: number;
  name: string;
  zone: number;
};

const items = ref<Array<Item>>([
  {
    id: 0,
    name: "an item",
    zone: 3,
  },
  {
    id: 1,
    name: "another item",
    zone: 3,
  },
]);

const getZone = (zone: Item["zone"]) =>
  items.value.filter((item) => item.zone === zone);

const onDrop = (zone: Item["zone"], item: Item) => {
  const index = items.value.findIndex((e) => e.id === item.id);
  items.value.splice(index, 1);
  items.value.push({ ...item, zone });
};
</script>

<template>
  <DragContext>
    <div class="not-content">
      <div class="flex gap-2 items-center">
        <Droppable v-slot="{ hovered }" @drop="(e) => onDrop(1, e)">
          <div
            class="h-32 w-32 bg-gray-200 dark:bg-gray-800 transition-opacity"
            :class="[hovered ? 'opacity-50' : '']"
          >
            <Draggable
              v-for="item in getZone(1)"
              :key="item.id"
              :data="item"
              v-slot="{ dragging }"
            >
              <div
                class="h-32 w-32"
                :class="[
                  dragging
                    ? 'dark:bg-accent-600 bg-accent-400'
                    : 'bg-accent-200 dark:bg-accent-800 hover:bg-accent-300 dark:hover:bg-accent-700',
                ]"
              >
                {{ item.name }}
              </div>
            </Draggable>
          </div>
        </Droppable>
        <Droppable
          v-slot="{ hovered, notAllowed }"
          :disabled="getZone(2).length >= 1"
          @drop="(e) => onDrop(2, e)"
        >
          <div
            class="h-32 w-32 bg-gray-200 dark:bg-gray-800 border-2 relative"
            :class="[
              hovered ? 'border-dotted border-red-500' : 'border-transparent',
            ]"
          >
            <Draggable
              v-for="item in getZone(2)"
              :key="item.id"
              :data="item"
              v-slot="{ dragging }"
            >
              <div
                class="h-32 w-32"
                :class="[
                  dragging
                    ? 'dark:bg-accent-600 bg-accent-400'
                    : 'bg-accent-200 dark:bg-accent-800 hover:bg-accent-300 dark:hover:bg-accent-700',
                ]"
              >
                {{ item.name }}
              </div>
            </Draggable>
            <div
              v-show="notAllowed"
              class="absolute inset-0 bg-red-500/50"
            ></div>
          </div>
        </Droppable>
      </div>
      <Droppable v-slot="{ hovered }" @drop="(e) => onDrop(3, e)">
        <div
          class="flex gap-2 items-center mt-4 w-full bg-gray-200 dark:bg-gray-800 h-32 border-2"
          :class="[
            hovered ? 'border-dotted border-red-500' : 'border-transparent',
          ]"
        >
          <Draggable
            v-for="item in getZone(3)"
            :key="item.id"
            :data="item"
            v-slot="{ dragging }"
            fallback-class="opacity-50"
          >
            <div
              class="h-32 w-32"
              :class="[
                dragging
                  ? 'dark:bg-accent-600 bg-accent-400'
                  : 'bg-accent-200 dark:bg-accent-800 hover:bg-accent-300 dark:hover:bg-accent-700',
              ]"
            >
              {{ item.name }}
            </div>
          </Draggable>
        </div>
      </Droppable>
    </div>
  </DragContext>
</template>

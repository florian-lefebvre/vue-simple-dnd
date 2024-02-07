<script setup lang="ts">
import { ref } from "vue";
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";

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
</script>

<template>
  <div>
    <h1 class="text-xl">Vue Simple Draggable</h1>
    <div class="flex gap-2 items-center">
      <Droppable
        v-slot="{ hovered }"
        @drop="(item: Item) => {
        items.find(e => e.id === item.id)!.zone = 1
      }"
      >
        <div
          class="h-32 w-32 bg-gray-800 border-2"
          :class="[
            hovered ? 'border-dotted border-red-500' : 'border-transparent',
          ]"
        >
          <Draggable
            v-for="item in getZone(1)"
            :key="item.id"
            :item="item"
            v-slot="{ dragging }"
          >
            <div
              class="h-32 w-32"
              :class="[
                dragging ? 'bg-blue-600' : 'bg-blue-800 hover:bg-blue-700',
              ]"
            >
              {{ item.name }}
            </div>
          </Draggable>
        </div>
      </Droppable>
      <Droppable
        v-slot="{ hovered }"
        :max-items="1"
        :items-count="getZone(2).length"
        @drop="(item: Item) => {
        items.find(e => e.id === item.id)!.zone = 2
      }"
      >
        <div
          class="h-32 w-32 bg-gray-800 border-2"
          :class="[
            hovered ? 'border-dotted border-red-500' : 'border-transparent',
          ]"
        >
          <Draggable
            v-for="item in getZone(2)"
            :key="item.id"
            :item="item"
            v-slot="{ dragging }"
          >
            <div
              class="h-32 w-32"
              :class="[
                dragging ? 'bg-blue-600' : 'bg-blue-800 hover:bg-blue-700',
              ]"
            >
              {{ item.name }}
            </div>
          </Draggable>
        </div>
      </Droppable>
    </div>
    <Droppable
      v-slot="{ hovered }"
      @drop="(item: Item) => {
        items.find(e => e.id === item.id)!.zone = 3
      }"
    >
      <div
        class="flex gap-2 items-center mt-4 w-full bg-gray-800 min-h-32 p-2 border-2"
        :class="[
          hovered ? 'border-dotted border-red-500' : 'border-transparent',
        ]"
      >
        <Draggable
          v-for="item in getZone(3)"
          :key="item.id"
          :item="item"
          v-slot="{ dragging }"
        >
          <div
            class="h-32 w-32"
            :class="[
              dragging ? 'bg-blue-600' : 'bg-blue-800 hover:bg-blue-700',
            ]"
          >
            {{ item.name }}
          </div>
        </Draggable>
      </div>
    </Droppable>
  </div>
</template>

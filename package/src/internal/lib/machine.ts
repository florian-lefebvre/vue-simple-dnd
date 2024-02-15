import { produce } from "immer";
import { assign, not, setup } from "xstate";
import type { Draggable, Droppable } from "../../types.js";

type Input = {
  notify: (payload: { id: Droppable["id"]; data: Draggable["data"] }) => void;
};

export const dragMachine = setup({
  types: {
    events: {} as
      | { type: "stopDragging" }
      | { type: "startDragging"; draggable: Draggable }
      | { type: "updateDraggable"; draggable: Draggable }
      | { type: "updateDroppable"; droppable: Droppable }
      | { type: "removeDroppable"; id: Droppable["id"] },
    input: {} as Input,
    context: {} as {
      draggable: null | Draggable;
      droppables: Array<Droppable>;
      biggestDroppableId: null | string;
    } & Input,
  },
  actions: {
    resetContext: assign({
      draggable: null,
      droppables: [],
      biggestDroppableId: null,
    }),
    updateBiggestDroppable: assign(({ context }) =>
      produce(context, (draft) => {
        if (!draft.draggable) {
          return;
        }
        // https://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
        const x1 = draft.draggable.dimensions;

        const areas = draft.droppables.map(({ dimensions: x2 }) => {
          const xOverlap = Math.max(
            0,
            Math.min(x1[2], x2[2]) - Math.max(x1[0], x2[0])
          );
          const yOverlap = Math.max(
            0,
            Math.min(x1[3], x2[3]) - Math.max(x1[1], x2[1])
          );
          const overlapArea = xOverlap * yOverlap;

          return overlapArea;
        });

        const index = areas.indexOf(Math.max(...areas));

        draft.biggestDroppableId =
          index === -1 ? null : draft.droppables[index].id;
      })
    ),
  },
  guards: {
    areDroppablesEmpty: ({ context }) => context.droppables.length === 0,
  },
}).createMachine({
  id: "simpleDraggable",
  context: ({ input }) => ({
    draggable: null,
    droppables: [],
    biggestDroppableId: null,
    notify: input.notify,
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        startDragging: {
          actions: [
            assign(({ context, event }) =>
              produce(context, (draft) => {
                draft.draggable = event.draggable;
              })
            ),
          ],
          target: "dragging",
        },
      },
    },
    dragging: {
      on: {
        stopDragging: [
          {
            guard: not("areDroppablesEmpty"),
            actions: [
              ({ context }) => {
                if (context.biggestDroppableId) {
                  context.notify({
                    id: context.biggestDroppableId,
                    data: context.draggable!.data,
                  });
                }
              },
              "resetContext",
            ],
            target: "idle",
          },
          {
            actions: ["resetContext"],
            target: "idle",
          },
        ],
        removeDroppable: {
          actions: [
            assign(({ context, event }) =>
              produce(context, (draft) => {
                const index = draft.droppables.findIndex(
                  (d) => d.id === event.id
                );
                if (index !== -1) {
                  draft.droppables.splice(index, 1);
                }
              })
            ),
            "updateBiggestDroppable",
          ],
          target: "dragging",
        },
        updateDraggable: {
          actions: [
            assign(({ context, event }) =>
              produce(context, (draft) => {
                draft.draggable = event.draggable;
              })
            ),
            "updateBiggestDroppable",
          ],
          target: "dragging",
        },
        updateDroppable: {
          actions: [
            assign(({ context, event }) =>
              produce(context, (draft) => {
                const index = draft.droppables.findIndex(
                  (d) => d.id === event.droppable.id
                );
                if (index === -1) {
                  draft.droppables.push(event.droppable);
                } else {
                  draft.droppables[index] = event.droppable;
                }
              })
            ),
            "updateBiggestDroppable",
          ],
          target: "dragging",
        },
      },
    },
  },
});

export type Dimensions = [
  left: number,
  top: number,
  right: number,
  bottom: number
];

export type Draggable = {
  dimensions: Dimensions;
  data: any;
  droppableId: Droppable["id"];
};

export type Droppable = {
  id: string;
  dimensions: Dimensions;
};

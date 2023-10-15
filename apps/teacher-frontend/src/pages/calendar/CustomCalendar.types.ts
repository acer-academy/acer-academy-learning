export type Session = {
  id: number;
  status: string;
  location: string;
  resource: string;
  address: string;
};

export type EventItem = {
  start: Date;
  end: Date;
  data?: { session?: Session };
  isDraggable?: boolean;
};

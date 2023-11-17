import { SessionData } from 'libs/data-access/src/lib/types/session';

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
  data?: { session?: SessionData };
  isDraggable?: boolean;
};

import { ClassFrequencyEnum } from './CommonTypes';
import { SessionData } from './session';

export interface ClassCreateData {
  endRecurringDate: Date;
  frequency: ClassFrequencyEnum;
}

export interface ClassData {
    id: string;
    endRecurringDate: Date;
    frequency: ClassFrequencyEnum;
    sessions: SessionData[];
}


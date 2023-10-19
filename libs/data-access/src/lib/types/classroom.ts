import { CentreData } from "./centre";

export interface ClassroomData {
  id: string;
  name: string;
  available: boolean;
  capacity: number;
  centreId: string;
  centre: CentreData;
}

export interface ClassroomCreateData {
  name: string;
  available: boolean;
  capacity: number;
  centreId: string;
}

export interface ClassroomData {
  id: string;
  name: string;
  available: boolean;
  capacity: number;
  centreId: string;
}

export interface ClassroomCreateData {
  name: string;
  available: boolean;
  capacity: number;
  centreId: string;
}

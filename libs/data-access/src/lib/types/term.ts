export interface TermData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface TermCreateData {
  name: string;
  startDate: string;
  endDate: string;
}

export interface TermUpdateData {
  name?: string;
  startDate?: string;
  endDate?: string;
}

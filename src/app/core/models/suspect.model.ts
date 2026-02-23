export interface LocationEntry {
  city: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  departureTime: string;
}

export interface Suspect {
  id: number;
  name: string;
  age: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  history: LocationEntry[];
}
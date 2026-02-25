export interface LocationEntry {
  city: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  departureTime: string;
}


export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Suspect {
  id: number;
  name: string;
  age: number;
  riskLevel: RiskLevel;
  history: LocationEntry[];
}
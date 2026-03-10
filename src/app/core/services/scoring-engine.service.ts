import { Injectable } from '@angular/core';
import { Suspect } from '../models/suspect.model';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

@Injectable({
  providedIn: 'root'
})
export class ScoringEngineService {

  /**
   * Calculate crime probability score
   */
  calculateScore(
    suspect: Suspect,
    crimeLat: number,
    crimeLng: number,
    start: Date,
    end: Date
  ): number {

    let score = 0;

    suspect.history.forEach(entry => {

      const arrival = new Date(entry.arrivalTime);
      const departure = new Date(entry.departureTime);

      const timeOverlap =
        arrival <= end && departure >= start;

      const distance = this.getDistance(
        crimeLat,
        crimeLng,
        entry.latitude,
        entry.longitude
      );

      // Geographic scoring
      if (distance <= 1) score += 40;         // Same city approx
      else if (distance <= 10) score += 30;   // Nearby

      // Time scoring
      if (timeOverlap) score += 30;

      // Strong match bonus
      if (timeOverlap && distance <= 10) score += 20;
    });

    // Existing risk weight
    if (suspect.riskLevel === 'HIGH') score += 15;
    if (suspect.riskLevel === 'MEDIUM') score += 5;

    return score;
  }

  /**
   * Strict union type return
   */
  getRisk(score: number): RiskLevel {
    if (score >= 80) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Haversine distance formula (km)
   */
  private getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const R = 6371; // Earth radius km

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}
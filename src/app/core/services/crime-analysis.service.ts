import { Injectable } from '@angular/core';
import { SuspectService } from './suspect.service';
import { Suspect } from '../models/suspect.model';

@Injectable({
  providedIn: 'root'
})
export class CrimeAnalysisService {

  constructor(private suspectService: SuspectService) {}

  /**
   * Extract unique cities from master data
   */
  getAvailableCities(): string[] {

    const suspects = this.suspectService.getAll();

    const cities = suspects.flatMap(s =>
      s.history.map(h => h.city)
    );

    return [...new Set(cities)].sort();
  }

  /**
   * Production filtering
   * Supports:
   * - Only city
   * - Only date
   * - Both
   */
  // analyze(
  //   crimeCity: string | null,
  //   startDate: Date | null,
  //   endDate: Date | null
  // ): void {

  //   const suspects = this.suspectService.getAll();

  //   const filtered = suspects.filter(suspect =>
  //     suspect.history.some(entry => {

  //       const arrival = new Date(entry.arrivalTime);
  //       const departure = new Date(entry.departureTime);

  //       const cityMatch = crimeCity
  //         ? entry.city.toLowerCase() === crimeCity.toLowerCase()
  //         : true;

  //       const dateMatch =
  //         startDate && endDate
  //           ? arrival <= endDate && departure >= startDate
  //           : true;

  //       return cityMatch && dateMatch;
  //     })
  //   );

  //   this.suspectService.updateSuspects(filtered);
  // }

  // reset(): void {
  //   this.suspectService.updateSuspects(
  //     this.suspectService.getAll()
  //   );
  // }

analyze(
  crimeCity: string | null,
  startDate: Date | null,
  endDate: Date | null
): void {

  const suspects = this.suspectService.getAll();

  const filtered = suspects.filter(suspect =>
    suspect.history.some(entry => {

      const arrival = new Date(entry.arrivalTime);
      const departure = new Date(entry.departureTime);

      const cityMatch = crimeCity
        ? entry.city.toLowerCase() === crimeCity.toLowerCase()
        : true;

      const dateMatch =
        startDate && endDate
          ? arrival <= endDate && departure >= startDate
          : true;

      return cityMatch && dateMatch;
    })
  );

  // 🔥 CLEAR selection BEFORE updating list
  this.suspectService.clearSelection();

  this.suspectService.updateSuspects(filtered);
}

reset(): void {

  this.suspectService.clearSelection();

  this.suspectService.updateSuspects(
    this.suspectService.getAll()
  );
}

}
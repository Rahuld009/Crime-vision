import { Injectable } from '@angular/core';
import { SuspectService } from './suspect.service';
import { ScoringEngineService, RiskLevel } from './scoring-engine.service';
import { Suspect } from '../models/suspect.model';

@Injectable({
  providedIn: 'root'
})
export class CrimeAnalysisService {

  constructor(
    private suspectService: SuspectService,
    private scoringEngine: ScoringEngineService
  ) {}

  analyze(
    crimeLocation: string,
    startDate: Date,
    endDate: Date
  ): Suspect[] {

    const suspects = this.suspectService.getSnapshot();

    if (!crimeLocation || !startDate || !endDate) {
      return suspects;
    }

    const locationMatch = suspects
      .flatMap(s => s.history)
      .find(h =>
        h.city.toLowerCase() === crimeLocation.toLowerCase()
      );

    if (!locationMatch) {
      console.warn('Crime location not found.');
      return suspects;
    }

    const crimeLat = locationMatch.latitude;
    const crimeLng = locationMatch.longitude;

    const analyzedSuspects: Suspect[] = suspects.map(suspect => {

      const score = this.scoringEngine.calculateScore(
        suspect,
        crimeLat,
        crimeLng,
        startDate,
        endDate
      );

      const updatedRisk: RiskLevel =
        this.scoringEngine.getRisk(score);

      return {
        ...suspect,
        riskLevel: updatedRisk
      };
    });

    // Sort by risk priority
    const riskWeight: Record<RiskLevel, number> = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };

    analyzedSuspects.sort((a, b) =>
      riskWeight[b.riskLevel] - riskWeight[a.riskLevel]
    );

    // Update reactive stream safely
    this.suspectService.updateSuspects(analyzedSuspects);

    return analyzedSuspects;
  }
}
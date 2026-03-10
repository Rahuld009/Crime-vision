import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Suspect } from '../models/suspect.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuspectService {

  /**
   * Master data store (never mutated)
   */
  private allSuspects: Suspect[] = [];

  /**
   * Public observable streams
   */
  private suspectsSubject = new BehaviorSubject<Suspect[]>([]);
  suspects$: Observable<Suspect[]> = this.suspectsSubject.asObservable();

  private selectedSuspectSubject = new BehaviorSubject<Suspect | null>(null);
  selectedSuspect$: Observable<Suspect | null> =
    this.selectedSuspectSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load suspects from JSON (or API later)
   */
  loadSuspects(): void {
    this.loadingSubject.next(true);

    this.http.get<Suspect[]>('assets/data/suspects.json')
      .pipe(
        tap((data) => {
          this.allSuspects = data; // preserve original
          this.suspectsSubject.next(data);
          this.errorSubject.next(null);
        }),
        catchError((error) => {
          console.error('Error loading suspects:', error);
          this.errorSubject.next('Failed to load suspects data.');
          return of([]);
        })
      )
      .subscribe(() => {
        this.loadingSubject.next(false);
      });
  }

  /**
   * Select a suspect
   */
  selectSuspect(suspect: Suspect): void {
    this.selectedSuspectSubject.next(suspect);
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedSuspectSubject.next(null);
  }

  /**
   * Production-safe search filter
   * Never mutates master data
   */
  filterSuspects(searchTerm: string): void {

    if (!searchTerm || searchTerm.trim() === '') {
      // Reset to original data
      this.suspectsSubject.next(this.allSuspects);
      return;
    }

    const filtered = this.allSuspects.filter(suspect =>
      suspect.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.suspectsSubject.next(filtered);
  }

  /**
   * Optional: Filter by risk level
   */
  filterByRisk(risk: 'LOW' | 'MEDIUM' | 'HIGH'): void {
    const filtered = this.allSuspects.filter(s => s.riskLevel === risk);
    this.suspectsSubject.next(filtered);
  }

  /**
   * Calculate time spent in location (hours)
   */
  calculateDuration(arrival: string, departure: string): number {
    const arrivalTime = new Date(arrival).getTime();
    const departureTime = new Date(departure).getTime();
    const diff = departureTime - arrivalTime;

    return Math.round(diff / (1000 * 60 * 60));
  }

  /**
   * Get total time spent across all cities
   */
  // getTotalTimeSpent(suspect: Suspect): number {
  //   return suspect.history.reduce((total, loc) => {
  //     return total + this.calculateDuration(loc.arrivalTime, loc.departureTime);
  //   }, 0);
  // }

  getTotalTimeSpent(suspect: any): string {
  if (!suspect?.history?.length) return '0 hours';

  let totalMs = 0;

  suspect.history.forEach((h: any) => {
    const arrival = new Date(h.arrivalTime).getTime();
    const departure = new Date(h.departureTime).getTime();
    totalMs += (departure - arrival);
  });

  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  return `${hours} hours`;
}

updateSuspects(data: Suspect[]): void {
  this.suspectsSubject.next(data);
}

getAll(): Suspect[] {
  return this.allSuspects;
}

}
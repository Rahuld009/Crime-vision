import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SuspectService } from '../../core/services/suspect.service';
import { Suspect, LocationEntry } from '../../core/models/suspect.model';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  suspect: Suspect | null = null;
  private subscription!: Subscription;

  constructor(public service: SuspectService) {}

  ngOnInit(): void {
    this.subscription = this.service.selectedSuspect$
      .subscribe(s => {
        this.suspect = s;
      });
  }

  getDuration(location: LocationEntry): number {
    return this.service.calculateDuration(
      location.arrivalTime,
      location.departureTime
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
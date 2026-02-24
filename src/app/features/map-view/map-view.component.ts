import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MapService } from '../../core/services/map.service';
import { SuspectService } from '../../core/services/suspect.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-map-view',
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {

  private subscription!: Subscription;

  constructor(
    private mapService: MapService,
    private suspectService: SuspectService
  ) {}

  

  ngAfterViewInit(): void {
    this.mapService.initMap('crime-map');

    this.subscription = this.suspectService.selectedSuspect$
      .subscribe(suspect => {
        if (suspect) {
          this.mapService.plotSuspect(suspect);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

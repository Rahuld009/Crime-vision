import { Component } from '@angular/core';
import { MapViewComponent } from '../map-view/map-view.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { SuspectListComponent } from '../suspect-list/suspect-list.component';
import { SuspectService } from '../../core/services/suspect.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MapViewComponent,
    TimelineComponent,
    SuspectListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

   constructor(private suspectService: SuspectService) {}

  ngOnInit(): void {
    this.suspectService.loadSuspects();   // 🔥 REQUIRED
  }

}

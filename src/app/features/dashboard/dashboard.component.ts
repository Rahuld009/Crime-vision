import { Component } from '@angular/core';
import { MapViewComponent } from '../map-view/map-view.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { SuspectListComponent } from '../suspect-list/suspect-list.component';
import { SuspectService } from '../../core/services/suspect.service';
import { CrimeAnalysisComponent } from '../crime-analysis/crime-analysis.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MapViewComponent,
    CrimeAnalysisComponent,
    TimelineComponent,
    SuspectListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

   constructor(private suspectService: SuspectService) {}

  ngOnInit(): void {
    this.suspectService.loadSuspects();   //  REQUIRED

    // this.suspectService.suspects$.subscribe(data => {
    //   if (data.length > 0) {
    //     this.suspectService.selectSuspect(data[0]); // auto select first
    //   }
    // });
  }

}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { InputTextModule } from 'primeng/inputtext';
// import { CalendarModule } from 'primeng/calendar';
// import { ButtonModule } from 'primeng/button';

// import { CrimeAnalysisService } from '../../core/services/crime-analysis.service';

// @Component({
//   standalone: true,
//   selector: 'app-crime-analysis',
//   templateUrl: './crime-analysis.component.html',
//   styleUrls: ['./crime-analysis.component.scss'],
//   imports: [
//     CommonModule,
//     FormsModule,
//     InputTextModule,
//     CalendarModule,
//     ButtonModule
//   ]
// })
// export class CrimeAnalysisComponent {

//   crimeLocation: string = '';
//   startDate: Date = new Date();
//   endDate: Date = new Date();

//   constructor(private analysisService: CrimeAnalysisService) {}

//   run(): void {
//     if (!this.isValidRange()) return;

//     this.analysisService.analyze(
//       this.crimeLocation,
//       this.startDate,
//       this.endDate
//     );
//   }

//   reset(): void {
//     const today = new Date();
//     this.crimeLocation = '';
//     this.startDate = today;
//     this.endDate = today;
//   }

//   isValidRange(): boolean {
//     return this.startDate <= this.endDate;
//   }

//   onStartDateChange(): void {
//     if (this.endDate < this.startDate) {
//       this.endDate = new Date(this.startDate);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

import { CrimeAnalysisService } from '../../core/services/crime-analysis.service';
import { SuspectService } from '../../core/services/suspect.service';

@Component({
  standalone: true,
  selector: 'app-crime-analysis',
  templateUrl: './crime-analysis.component.html',
  styleUrls: ['./crime-analysis.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    ButtonModule
  ]
})
export class CrimeAnalysisComponent implements OnInit {

  crimeLocation: string | null = null;
  cities: string[] = [];

  startDate!: Date;
  endDate!: Date;

  constructor(
    private analysisService: CrimeAnalysisService,
    private suspectService: SuspectService
  ) {}

  ngOnInit(): void {

    // Default last 7 days
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.endDate.getDate() - 7);

    // Derive cities from master data
    this.suspectService.suspects$.subscribe(() => {
      this.cities = this.analysisService.getAvailableCities();
    });

    // Run initial filter (last 7 days)
    this.analysisService.analyze(
      null,
      this.startDate,
      this.endDate
    );
  }

  run(): void {

    if (this.startDate > this.endDate) {
      this.endDate = new Date(this.startDate);
    }

    this.analysisService.analyze(
      this.crimeLocation,
      this.startDate,
      this.endDate
    );
  }

  onStartDateChange(): void {
    if (this.startDate > this.endDate) {
      this.endDate = new Date(this.startDate);
    }
  }

  reset(): void {

    this.crimeLocation = null;

    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.endDate.getDate() - 7);

    this.analysisService.reset();
  }
}
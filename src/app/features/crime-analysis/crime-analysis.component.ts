import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

import { CrimeAnalysisService } from '../../core/services/crime-analysis.service';

@Component({
  standalone: true,
  selector: 'app-crime-analysis',
  templateUrl: './crime-analysis.component.html',
  styleUrls: ['./crime-analysis.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    ButtonModule
  ]
})
export class CrimeAnalysisComponent {

  crimeLocation: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private analysisService: CrimeAnalysisService) {}

  run(): void {
    if (!this.isValidRange()) return;

    this.analysisService.analyze(
      this.crimeLocation,
      this.startDate,
      this.endDate
    );
  }

  reset(): void {
    const today = new Date();
    this.crimeLocation = '';
    this.startDate = today;
    this.endDate = today;
  }

  isValidRange(): boolean {
    return this.startDate <= this.endDate;
  }

  onStartDateChange(): void {
    if (this.endDate < this.startDate) {
      this.endDate = new Date(this.startDate);
    }
  }
}
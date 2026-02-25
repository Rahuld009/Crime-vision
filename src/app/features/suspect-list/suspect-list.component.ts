import { Component, OnInit } from '@angular/core';
import { SuspectService } from '../../core/services/suspect.service';
import { Suspect } from '../../core/models/suspect.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  selector: 'app-suspect-list',
  templateUrl: './suspect-list.component.html',
  styleUrls: ['./suspect-list.component.scss'],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    FormsModule,
    InputTextModule
  ]
})
export class SuspectListComponent implements OnInit {

  suspects: Suspect[] = [];
  searchText = '';
  selectedSuspect: Suspect | null = null;

  constructor(private suspectService: SuspectService) {}

  ngOnInit(): void {

  this.suspectService.suspects$.subscribe(data => {
    this.suspects = data;
    this.selectedSuspect = null; // 🔥 Clear table selection
  });

}

  getSeverity(risk: string) {
    switch (risk) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      default: return 'success';
    }
  }

  onSearch() {
    this.suspectService.filterSuspects(this.searchText);
  }

  onRowSelect(event: any) {
  this.suspectService.selectSuspect(event.data);
}
}
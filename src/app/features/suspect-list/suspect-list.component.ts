import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SuspectService } from '../../core/services/suspect.service';
import { Suspect } from '../../core/models/suspect.model';

@Component({
  standalone: true,
  selector: 'app-suspect-list',
  imports: [CommonModule],
  templateUrl: './suspect-list.component.html',
  styleUrls: ['./suspect-list.component.scss']
})
export class SuspectListComponent {

  suspects$: Observable<Suspect[]>;

  constructor(private service: SuspectService) {
    this.suspects$ = this.service.suspects$;
  }

  select(suspect: Suspect): void {
    this.service.selectSuspect(suspect);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value ?? '';
    this.service.filterSuspects(value);
  }
}
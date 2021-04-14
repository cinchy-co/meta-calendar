import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {AppApiService} from '../../app-api.service';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})
export class CalendarDetailComponent implements OnInit {
  @Input() dayDetails!: any;
  @Input() maxHeight!: number;
  @Input() calendarQuery!: any;
  @Output() closeDateClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private appApiService: AppApiService) {
  }

  ngOnInit(): void {
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.appApiService.goToEventUrl(event, this.calendarQuery);
  }

  closeDate(): void {
    this.closeDateClicked.emit(true);
  }

}

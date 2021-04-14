import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView
} from 'angular-calendar';
import {Subject} from 'rxjs';
import {add, addHours, endOfDay, isSameDay, isSameMonth, startOfDay} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {ColorsArr, ICalendarMeta, IEventResp} from '../../general.model';
import {AppApiService} from '../../app-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', {static: true}) modalContent!: TemplateRef<any>;
  @ViewChild('monthView') monthView!: ElementRef;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  activeDayIsOpen = false;
  colorsArr = ColorsArr;
  calendarQuery!: any;
  searchControl = new FormControl();
  selectedDayDetails!: any;
  heightForDetailsView!: number;
  originalSelectedEvents!: any;
  currentButtonState = 'today';
  callDoneFromRoute!: boolean;

  constructor(private modal: NgbModal, private cinchyService: CinchyService, private cdr: ChangeDetectorRef,
              private appApiService: AppApiService, private activatedRoute: ActivatedRoute,
              private toastr: ToastrService, private spinner: NgxSpinnerService) {
  }

  async ngOnInit(): Promise<any> {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (params && params.calendarId) {
        this.callDoneFromRoute = true;
        this.calendarQuery = await this.appApiService.getCalendarQueryById().toPromise();
        this.getDatesForEvents(this.calendarQuery);
        this.activeDayIsOpen = false;
        this.selectedDayDetails = null;
        this.originalSelectedEvents = null;
      }
    });
    if (!this.callDoneFromRoute && sessionStorage.getItem('calendarId')) {
      this.calendarQuery = await this.appApiService.getCalendarQueryById().toPromise();
      this.getDatesForEvents(this.calendarQuery);
    }
  }

  async getDatesForEvents(savedQuery: ICalendarMeta): Promise<any> {
    try {
      this.spinner.show();
      const allEventDetails: IEventResp[] = await this.appApiService.getEventDetails(savedQuery.queryDomain, savedQuery.queryName).toPromise();
      let colorIndex = 0;
      this.events = [];
      this.filteredEvents = [];
      allEventDetails.forEach((item: any, index: number) => {
        const color = {
          primary: item.Color,
          secondary: item.Color,
        };
        const [startDate, endDate] = [new Date(item.Event_Start_Date), new Date(item.Event_End_Date)];
        const [startHourTime, endHourTime] = [startDate.getHours(), endDate.getHours()];
        const startHourMinutes = startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes();
        const endHourMinutes = endDate.getMinutes() < 10 ? `0${endDate.getMinutes()}` : endDate.getMinutes();

        const actualEvent: CalendarEvent = {
          start: add(startOfDay(new Date(item.Event_Start_Date)), {hours: startHourTime, minutes: startDate.getMinutes()}),
          end: add(startOfDay(new Date(item.Event_End_Date)), {hours: endHourTime, minutes: endDate.getMinutes()}),
          allDay: item.Is_Full_Day_Event === 'Yes',
          title: `${item.Event_Title}`,
          color: item.Color ? color : this.colorsArr[colorIndex],
          meta: {
            id: item.Event_Cinchy_ID,
            eventUrl: item.Event_Table_Url,
            startHourTime: `${startHourTime}:${startHourMinutes}`,
            endHourTime: `${endHourTime}:${endHourMinutes}`,
            textColor: item.Text_Color || 'black'
          },
        };
        this.events.push(actualEvent);
        this.filteredEvents = [...this.events];
        colorIndex = (index + 1) % this.colorsArr.length === 0 ? 0 : colorIndex + 1;
      });
      this.viewDate = allEventDetails[0].Calendar_Start_Date ? new Date(allEventDetails[0].Calendar_Start_Date) : this.viewDate;
      this.subscribeToSearchStr();
      this.cdr.markForCheck();
      setTimeout(() => {
        this.heightForDetailsView = this.monthView.nativeElement.offsetHeight || 1000;
      }, 300);
      this.spinner.hide();
    } catch (e) {
      this.reset();
      this.toastr.error('Error while getting details about selected calendar. Please check your saved query', 'Error!');
      this.spinner.hide();
    }
  }

  reset(): void {
    this.selectedDayDetails = null;
    this.originalSelectedEvents = null;
    this.events = [];
    this.filteredEvents = [];
    this.cdr.markForCheck();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    const allEventsForSelectedDate = this.events.filter((event: CalendarEvent) => event.start.toDateString() === date.toDateString());
    this.originalSelectedEvents = {date, events: allEventsForSelectedDate};
    this.selectedDayDetails = events && events.length ? {date, events} : null;
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0);
      this.originalSelectedEvents = this.activeDayIsOpen ? this.originalSelectedEvents : null;
      this.viewDate = date;
    }
  }

  weekHeaderClicked(headerData: any): void {
    const date = headerData.day.date;
    const events = this.filteredEvents.filter((event: CalendarEvent) => event.start.toDateString() === date.toDateString());
    this.dayClicked({date, events});
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {...event, start: newStart, end: newEnd};
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.appApiService.goToEventUrl(event, this.calendarQuery);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.selectedDayDetails = null;
    this.originalSelectedEvents = null;
    this.activeDayIsOpen = false;
  }

  checkForDate(): void {
    this.currentButtonState = this.appApiService.getIfTodaysDatePresentInView(this.view, this.viewDate);
  }

  subscribeToSearchStr(): void {
    let searchFromUrl = sessionStorage.getItem('searchString');
    this.searchControl.valueChanges.subscribe(value => {
      const searchValue = value ? value.split('-')[0].trim() : value;
      if (searchValue) {
        this.filteredEvents = this.events
          .filter(eventItem => eventItem.title && eventItem.title.toLowerCase().search(searchValue.toLowerCase()) !== -1);
      } else {
        this.filteredEvents = this.events;
      }
      this.updateSelectedDateEvents(searchValue);
      if (value !== searchFromUrl) {
        sessionStorage.setItem('searchString', '');
        searchFromUrl = '';
      }
    });
    if (searchFromUrl) {
      this.searchControl.setValue(searchFromUrl);
    }
  }

  updateSelectedDateEvents(searchStr: string): void {
    if (searchStr && this.originalSelectedEvents) {
      const newFilteredEvents = this.originalSelectedEvents.events
        .filter((eventItem: CalendarEvent) => eventItem.title && eventItem.title.toLowerCase().search(searchStr.toLowerCase()) !== -1);
      this.selectedDayDetails = newFilteredEvents && newFilteredEvents.length
        ? {date: this.originalSelectedEvents.date, events: newFilteredEvents} : null;
    } else {
      this.selectedDayDetails = this.originalSelectedEvents ? {...this.originalSelectedEvents} : null;
    }
  }

}

import {Injectable} from '@angular/core';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ICalendarMeta} from './general.model';
import {CalendarEvent} from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class AppApiService {

  constructor(private cinchyService: CinchyService) {
  }

  getCalendarQueryById(): Observable<ICalendarMeta> {
    const params = {
      '@calendarId': sessionStorage.getItem('calendarId')
    };
    return this.cinchyService.executeQuery('Cinchy Calendar', 'Get Calendar Meta', params).pipe(
      map((result: any) => (result.queryResult.toObjectArray())[0])
    );
  }

  getEventDetails(queryDomain: string, queryName: string): Observable<any> {
    const params = {};
    return this.cinchyService.executeQuery(queryDomain, queryName, params).pipe(
      map((result: any) => result.queryResult.toObjectArray())
    );
  }

  getAllCalendars(): Observable<any> {
    const params = {};
    return this.cinchyService.executeQuery('Cinchy Calendar', 'Get All Calendars', params).pipe(
      map((result: any) => result.queryResult.toObjectArray())
    );
  }

  getIfTodaysDatePresentInView(view: string, date: Date): string {
    const todaysDate = new Date();
    const passedDate = new Date(date);
    return todaysDate.toDateString() === passedDate.toDateString() ? 'today' : todaysDate > passedDate ? 'past' : 'future';
  }

  goToEventUrl(event: CalendarEvent, calendarQuery: any): void {
    const filteredTableUrl = event.meta.eventUrl ? event.meta.eventUrl : calendarQuery.tableUrl ? `${calendarQuery.tableUrl}?viewId=0&fil[Cinchy%20Id].Op=Equals&fil[Cinchy%20Id].Val=${event.meta.id}`
      : calendarQuery.tableUrl;
    window.open(filteredTableUrl, '_blank');
  }
}

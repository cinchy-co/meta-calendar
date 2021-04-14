import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlatpickrModule} from 'angularx-flatpickr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CinchyConfig, CinchyModule, CinchyService} from '@cinchy-co/angular-sdk';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {AllCalendarComponent} from './pages/all-calendar/all-calendar.component';
import {CalendarDetailComponent} from './pages/calendar-detail/calendar-detail.component';
import {SchedulerComponent} from './pages/scheduler/scheduler.component';
import {Time24to12Format} from './pipes/time24to12.pipe';
import {ConfigService} from './config.service';
import {ToastrModule} from 'ngx-toastr';
import {NgxSpinnerModule} from 'ngx-spinner';


export function appLoadFactory(config: ConfigService): any {
  return () => config.loadConfig().toPromise();
}

export function getBaseUrl(): string {
  return document.getElementsByTagName('base')[0].href;
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    AllCalendarComponent,
    CalendarDetailComponent,
    SchedulerComponent,
    Time24to12Format
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CinchyModule.forRoot(),
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [ConfigService],
      multi: true
    },
    CinchyModule,
    CinchyService,
    {
      provide: CinchyConfig,
      useFactory: (config: ConfigService) => {
        return config.envConfig;
      },
      deps: [ConfigService]
    },
    {provide: 'BASE_URL', useFactory: getBaseUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

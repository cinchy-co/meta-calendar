import {Component, OnInit} from '@angular/core';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  fullScreenHeight!: number;
  loggedIn!: boolean;
  calenderId!: string;

  constructor(private cinchyService: CinchyService) {
    this.setRowAndCalendarId();
  }

  setRowAndCalendarId(): void {
    let calendarId = this.getQueryStringValue('calendarId', window.location.search);
    let searchString = this.getQueryStringValue('searchString', window.location.search);
    if (!calendarId) {
      calendarId = this.getQueryStringValue('calendarId', document.referrer);
    }
    if (!searchString) {
      searchString = this.getQueryStringValue('searchString', document.referrer);
    }
    if (!sessionStorage.getItem('calendarId') || calendarId) {
      sessionStorage.setItem('calendarId', calendarId);
    }

    if (!sessionStorage.getItem('searchString') || searchString) {
      sessionStorage.setItem('searchString', searchString);
    }
    this.calenderId = sessionStorage.getItem('calendarId') as string;
    console.log('calendarId', sessionStorage.getItem('calendarId'), 'searchString', sessionStorage.getItem('searchString'));
  }

  getQueryStringValue(key: string, url: string): string {
    return decodeURIComponent(url.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  }

  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage, false);
    this.cinchyService.checkIfSessionValid().toPromise().then(response => {
      if (response.accessTokenIsValid) {
        console.log('Already logged in!');
        this.loggedIn = true;
      } else {
        this.cinchyService.login().then(success => {
          if (success) {
            this.loggedIn = true;
          }
        }, error => {
          console.error('Could not login: ', error);
        });
      }
    });
  }

  // get Full Screen height of screen
  receiveMessage(event: any): void {
    if (event.data.toString().startsWith('[Cinchy][innerHeight]')) {
      this.fullScreenHeight = parseInt(event.data.toString().substring(21), 10) + 4;
      localStorage.setItem('fullScreenHeight', this.fullScreenHeight.toString());
      const elements = document.getElementsByClassName('full-height-element');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        // @ts-ignore
        elements[i]['style'].height = this.fullScreenHeight + 'px';
      }
    }
  }
}

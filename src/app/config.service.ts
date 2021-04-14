import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private enviornmentConfig!: any;
  fullScreenHeight!: number;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    window.addEventListener('message', this.receiveMessage, false);
    this.setRowAndFormId();
  }

  setRowAndFormId(): void {
    let formId = this.getQueryStringValue('formId', window.location.search);
    let rowId = this.getQueryStringValue('rowId', window.location.search);
    if (!rowId) {
      formId = this.getQueryStringValue('formId', document.referrer);
      rowId = this.getQueryStringValue('rowId', document.referrer);
    }
    // tslint:disable-next-line:no-unused-expression
    formId && sessionStorage.setItem('formId', formId);

    if (!sessionStorage.getItem('rowId') || rowId){
      // tslint:disable-next-line:triple-equals
      rowId && rowId != 'null' ? sessionStorage.setItem('rowId', rowId) : sessionStorage.removeItem('rowId');
    }
    console.log('Row id config', rowId, 'session',  sessionStorage.getItem('rowId'));
  }

  getQueryStringValue(key: string, url: string): string {
    // tslint:disable-next-line:max-line-length
    return decodeURIComponent(url.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  }

  get envConfig(): string {
    return this.enviornmentConfig;
  }

  loadConfig(): any {
    return forkJoin(this.getEnvUrl());
  }

  getEnvUrl(): Observable<any> {
    const url = `${this.baseUrl}assets/config.json`;
/*    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })*/
    return this.http
      .get<any>(url).pipe(
        tap(config => {
          this.enviornmentConfig = config;
        }));
  }

  receiveMessage(event: any): void {
    if (event.data.toString().startsWith('[Cinchy][innerHeight]')) {
      this.fullScreenHeight = parseInt(event.data.toString().substring(21), 10) + 4;
      console.log('receiveMessage  IF', this.fullScreenHeight);
      localStorage.setItem('fullScreenHeight', this.fullScreenHeight.toString());
      const elements: any = document.getElementsByClassName('full-height-element');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
          if (window.location !== window.parent.location){
            elements[i].style.height = this.fullScreenHeight + 'px';
          }
        }, 500);
      }
    }
  }
}

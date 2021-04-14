import {Component, OnInit} from '@angular/core';
import {AppApiService} from '../../app-api.service';
import {IOption} from '../../general.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-all-calendar',
  templateUrl: './all-calendar.component.html',
  styleUrls: ['./all-calendar.component.scss']
})
export class AllCalendarComponent implements OnInit {
  allOptions!: IOption[];
  selectedOption!: IOption;

  constructor(private appApiService: AppApiService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  async ngOnInit(): Promise<any> {
    this.allOptions = await this.appApiService.getAllCalendars().toPromise();
    const selectedCalendarId = sessionStorage.getItem('calendarId');
    if (selectedCalendarId) {
      this.selectedOption = this.allOptions.find(option => option.id === selectedCalendarId) as IOption;
    }
  }

  optionSelected(option: IOption): void {
    this.selectedOption = option;
    sessionStorage.setItem('calendarId', option.id);
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {calendarId: option.id},
        queryParamsHandling: 'merge'
      });
  }

}

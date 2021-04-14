import {CalendarEvent, CalendarEventAction} from 'angular-calendar';

export interface IEventResp {
  Calendar_Start_Date: string;
  Color: string;
  Event_Cinchy_ID: number;
  Event_End_Date: string;
  Event_End_Hour?: string;
  Event_Start_Date: string;
  Event_Start_Hour?: string;
  Event_Table_Url: string;
  Event_Title: string;
  Is_Full_Day_Event: any;
  Text_Color: string; /*-- CSS color*/
}

export type Full_Day_Event = 'Yes' | 'No';

export interface ICalendarMeta {
  title: string;
  queryName: string;
  queryDomain: string;
}

export interface IOption {
  label: string;
  id: string;
}

export enum IViewType {
  month = 'month',
  week = 'week',
  day = 'day',
}

export const ColorsArr: any = [
  {
    primary: 'papayawhip',
    secondary: '#D1E8FF',
  },
  {
    primary: 'lightgoldenrodyellow',
    secondary: '#FDF1BA',
  },
  {
    primary: '#FAE3E3',
    secondary: '#FDF1BA',
  },
];


/*
actions: CalendarEventAction[] = [
  {
    label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    a11yLabel: 'Edit',
    onClick: ({event}: { event: CalendarEvent }): void => {
      this.handleEvent('Edited', event);
    },
  },
  {
    label: '<i class="fas fa-fw fa-trash-alt"></i>',
    a11yLabel: 'Delete',
    onClick: ({event}: { event: CalendarEvent }): void => {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.handleEvent('Deleted', event);
    },
  },
];*/

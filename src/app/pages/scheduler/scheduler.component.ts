import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, Input, ViewEncapsulation} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {addDays, addMinutes, endOfWeek} from 'date-fns';

function floorToNearest(amount: number, precision: number): number {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number): number {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string): string {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
    return '';
  }

  dayTooltip(event: CalendarEvent, title: string): string {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
    return '';
  }
}

// tslint:disable-next-line max-classes-per-file
@Component({
  selector: 'app-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'scheduler.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .disable-hover {
        pointer-events: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SchedulerComponent {
  @Input() events: CalendarEvent[] = [];
  viewDate = new Date();
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  startDragToCreate(segment: WeekViewHourSegment, mouseDownEvent: MouseEvent, segmentElement: HTMLElement): void {
    console.log('SEGMENTY', segment, mouseDownEvent, segmentElement);
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(
          fromEvent(document, 'mouseup')))
      .subscribe((mouseMoveEvent: any) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
  }

  private refresh(): void {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  updateEvent(eventToUpdate: CalendarEvent): void {
    eventToUpdate.title = 'NEW NOW';
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter(event => event.id !== eventToDelete.id);
  }
}

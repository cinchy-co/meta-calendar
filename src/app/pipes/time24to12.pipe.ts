import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'time24to12Transform'})
export class Time24to12Format implements PipeTransform {
  transform(time: any): any {
    const hourAndMinutes = time.split(':');
    let properTime = time;
    if (hourAndMinutes && hourAndMinutes[0] && hourAndMinutes[0].length < 2) {
      properTime = `0${properTime}`;
    }
    const time24To12 = (a: string) => {
      // below date doesn't matter.
      return (new Date('1955-11-05T' + a + 'Z')).toLocaleTimeString('bestfit', {
        timeZone: 'UTC',
        hour12: !0,
        hour: 'numeric',
        minute: 'numeric'
      });
    };

    return time24To12(properTime);
  }
}

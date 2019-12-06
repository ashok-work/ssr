import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'eventExpired'
})
export class EventDatePipe implements PipeTransform {

    transform(event_start_time: any, args?: any): any {
        // console.log('EventDatePipe');
        let d1 = new Date();
        let d2 = new Date(event_start_time);
        if (d2.getTime() >= d1.getTime()) {
            return false;
        } else {
            return true;
        }
    }
}

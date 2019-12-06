import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventImage'
})
export class EventImagePipe implements PipeTransform {

  transform(event: any, args?: any): any {
    if (event.event_image) {
      if ("image_file" in event.event_image) {
        return event.event_image.image_file;
      } else {
        return event.image;
      }
    } else {
      if (event.image) {
        return event.image;
      } else {
        return "assets/dummyimg2.jpg";
      }
    }
  }

}

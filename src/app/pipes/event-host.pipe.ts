import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from "../services/utils/utils.service";

@Pipe({
  name: 'eventHost'
})
export class EventHostPipe implements PipeTransform {
  constructor(private utils: UtilsService) { }
  transform(event: any, args?: any): any {
    if (event['host'] === this.utils.user['user_id'] && !event['is_co_host']) {
      return 'Host: You';
    } else if (event['host'] !== this.utils.user['user_id'] && event['is_co_host']) {
      return 'Co Host: You';
    } else if (event['host'] !== this.utils.user['user_id'] && !event['is_co_host']) {
      return 'Host: ' +event.host_name;
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userImage'
})
export class UserImagePipe implements PipeTransform {

  transform(user_image: any, args?: any): any {
    if (user_image && typeof user_image === 'object') {
      if (user_image.Location) {
        return user_image.Location;
      } else {
        return 'assets/images/user.png';
      }
    } else {
      return 'assets/images/user.png';
    }
  }

}

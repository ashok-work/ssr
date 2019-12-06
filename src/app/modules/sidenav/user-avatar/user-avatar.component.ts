import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  img: string;
  constructor(public utilsService: UtilsService) { }

  assignImage() {
    const userRef = this.utilsService.user;
    if (userRef && userRef.user_image && userRef.user_image.Location) {
      this.img = userRef.user_image.Location;
    } else {
      this.img = "assets/images/user.png";
    }
  }
  ngOnInit() {
    this.assignImage();
    this.utilsService.updateSpecificEvents.subscribe((value: string) => {
      if (value == 'avatar') {
        this.assignImage();
      }
    });
  }

}

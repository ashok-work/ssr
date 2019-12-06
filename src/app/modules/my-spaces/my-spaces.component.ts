import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-spaces',
  templateUrl: './my-spaces.component.html',
  styleUrls: ['./my-spaces.component.scss']
})
export class MySpacesComponent implements OnInit {
  spaces: any = [];
  totalSpaces: any;
  page = 0;

  constructor(public services: CommonService, public router: Router) {
    this.getMySpaces(0);
    this.services.setTitle('Your Listings');
  }

  ngOnInit() {

  }

  navigateToMenu(space) {
    // let space_name = space.name.replace(/\s+/g, '-');
    let space_name = encodeURIComponent(space.name);
    let url = '/add-menu/' + space.space_id + '/' + space_name;
    this.router.navigate([url]);
  }


  showDetailsPage(id: any) {
    this.router.navigate(["/details" + "/" + id]);
  }

  /**
   * submit user signin form
   */
  getMySpaces(pageNumber) {
    this.page = pageNumber;
    const request = {
      params: {
        page: pageNumber,
        limit: 10
      },
      method: 'GET',
      action_url: '/spaces/my_spaces/list'
    };
    this.services.presentLoading();
    this.services.doHttp(request).subscribe(
      data => {
        console.log(data);
        this.services.dismissLoading();
        this.spaces = data['data'];
        this.totalSpaces = data['total_count'];
      },
      error => {
        console.log(error);
        this.services.dismissLoading();
        this.services.errorHandler(error);
      });
  }

  editSpace(space_id) {
    this.router.navigate(['/create-space-step1/' + space_id]);
  }

  previewSpace(space_id) {
    this.router.navigate(['/details/' + space_id]);
  }

  updateOperatingHours(space) {
    // let space_name = space.name.replace(/\s+/g, '-');
    let space_name = encodeURIComponent(space.name);
    let url = `/operating-hours/${space.space_id}/${space_name}`;
    this.router.navigate([url]);
  }

  updateSpaceInfo(space) {
    // let space_name = space.name.replace(/\s+/g, '-');
    let space_name = encodeURIComponent(space.name);
    let url = `/update-info/${space.space_id}/${space_name}`;
    this.router.navigate([url]);
  }
}

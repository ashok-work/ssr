import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { HostCancelDialogComponent } from './host-cancel-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-requests',
  templateUrl: './booking-requests.component.html',
  styleUrls: ['./booking-requests.component.scss']
})
export class BookingRequestsComponent implements OnInit {

  activePage = 'pending';

  constructor(
    public commonServices: CommonService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let params = this.route.params['value']

    if (params['path_name']) this.activePage = params['path_name'];
    else this.router.navigate(['booking-requests', 'pending']);
  }

  ngOnInit() {
  }

  selectPage(pageName) {
    this.router.navigate(['booking-requests', pageName]);
  }
}
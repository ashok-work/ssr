import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-requests',
  templateUrl: './past-requests.component.html',
  styleUrls: ['./past-requests.component.scss']
})
export class PastRequestsComponent implements OnInit {

  totalRequests: any;
  requests: any = [];
  page = 0;

  constructor(
    public router: Router,
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle('Past Requests');
  }

  ngOnInit() {
    this.getPastRequests(0);
  }

  getPastRequests(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/host_bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'complete'
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.totalRequests = data['total_count'];
        this.requests = data['bookings'];
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      }
    );
  }

  showBookingDetails(id) {
    this.router.navigate(['host/booking', id]);
  }

}

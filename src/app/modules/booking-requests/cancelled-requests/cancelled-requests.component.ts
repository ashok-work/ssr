import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-cancelled-requests',
  templateUrl: './cancelled-requests.component.html',
  styleUrls: ['./cancelled-requests.component.scss']
})
export class CancelledRequestsComponent implements OnInit {

  totalRequests: any;
  requests: any = [];
  page = 0;

  constructor(
    public commonServices: CommonService
  ) {
    this.commonServices.setTitle('Cancelled Requests');
  }

  ngOnInit() {
    this.getCancelledRequests(0);
  }

  getCancelledRequests(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/host_bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'cancelled,rejected'
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

}

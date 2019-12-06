import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-cancelled-bookings',
  templateUrl: './cancelled-bookings.component.html',
  styleUrls: ['./cancelled-bookings.component.scss']
})
export class CancelledBookingsComponent implements OnInit {

  totalBookings: any;
  bookings: any = [];
  page = 0;

  constructor(
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle("Cancelled Requests");
  }

  ngOnInit() {
    this.getCancelledBookings(0);
  }

  getCancelledBookings(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'cancelled,rejected'
      }
    };

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.totalBookings = data['total_count'];
        this.bookings = data['items'];
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      }
    );
  }
}

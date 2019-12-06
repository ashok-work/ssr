import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-bookings',
  templateUrl: './past-bookings.component.html',
  styleUrls: ['./past-bookings.component.scss']
})
export class PastBookingsComponent implements OnInit {

  totalBookings: any;
  bookings: any = [];
  page = 0;

  constructor(
    public router: Router,
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle("Past Requests");
  }

  ngOnInit() {
    this.getPastBookings(0);
  }

  getPastBookings(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'complete'
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

  showBookingDetails(id) {
    this.router.navigate(['booking', id]);
  }
}

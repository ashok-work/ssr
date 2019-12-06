import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class PendingRequestsComponent implements OnInit {

  totalRequests: any;
  requests: any = [];
  page = 0;

  constructor(
    public commonServices: CommonService,
    public router: Router,
  ) {
    this.commonServices.setTitle('Pending Requests');
  }

  ngOnInit() {
    this.getPendingRequests(0);
  }

  getPendingRequests(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/host_bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'processing'
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

  acceptBooking(booking_id, index) {
    const request = {
      action_url: '/spaces/booking/accept',
      method: 'PUT',
      params: {
        booking_id: booking_id
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.requests.splice(index, 1);
        this.totalRequests--;
        this.commonServices.notification(data['msg']);
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      }
    );
  }

  rejectBooking(booking_id, index) {
    const request = {
      action_url: '/spaces/booking/reject',
      method: 'PUT',
      params: {
        booking_id: booking_id
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.requests.splice(index, 1);
        this.totalRequests--;
        this.commonServices.notification(data['msg']);
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

import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { MatDialog } from '@angular/material';
import { HostCancelDialogComponent } from '../host-cancel-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approved-requests',
  templateUrl: './approved-requests.component.html',
  styleUrls: ['./approved-requests.component.scss']
})
export class ApprovedRequestsComponent implements OnInit {

  totalRequests: any;
  requests: any = [];
  page = 0;

  constructor(
    public router: Router,
    public commonServices: CommonService,
    public dialog: MatDialog
  ) {
    this.commonServices.setTitle('Approved Requests');
  }

  ngOnInit() {
    this.getApprovedRequests(0);
  }

  getApprovedRequests(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/host_bookings',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        order_status: 'accepted'
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

  cancelBooking(bookingId: number, index): void {
    const dialogRef = this.dialog.open(HostCancelDialogComponent, {
      width: '600px',
      data: {
        bookingId: bookingId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = {
          action_url: '/spaces/booking/cancel/host',
          method: 'PUT',
          params: {
            booking_id: bookingId
          }
        };
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
    });
  }

  showBookingDetails(id) {
    this.router.navigate(['host/booking', id]);
  }

}

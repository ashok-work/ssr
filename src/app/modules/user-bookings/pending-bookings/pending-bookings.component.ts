import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { MatDialog } from '@angular/material';
import { CancelDialogComponent } from '../cancel-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-bookings',
  templateUrl: './pending-bookings.component.html',
  styleUrls: ['./pending-bookings.component.scss']
})
export class PendingBookingsComponent implements OnInit {

  totalBookings: any;
  bookings: any = [];
  page = 0;

  constructor(
    public commonServices: CommonService,
    public dialog: MatDialog,
    public router: Router,
  ) {
    this.commonServices.setTitle("Pending Requests");
  }

  ngOnInit() {
    this.getPendingBookings(0);
  }

  getPendingBookings(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/bookings',
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

  openCancelDialog(bookingId: number, cancellationPolicy: string, index: number): void {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      width: '450px',
      data: {
        policy: cancellationPolicy,
        bookingId: bookingId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = {
          action_url: '/spaces/booking/cancel/user',
          method: 'PUT',
          params: {
            booking_id: bookingId
          }
        };
        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
          data => {
            console.log('token', data);
            this.bookings.splice(index, 1);
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
    this.router.navigate(['booking', id]);
  }
}

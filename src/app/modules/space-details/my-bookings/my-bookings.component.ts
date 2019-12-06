import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { HostBookingDetails } from 'src/app/interfaces/spaces';
import { PageEvent, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  @Input('spaceId') spaceId: string;
  search_text = '';
  totalSizes = 100;
  pageSize = 5;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // show Only When Array has data
  showData = false;

  currentTabIndex = 100;

  SHOW_DATA = [];

  bookingStatus = [
    'Accepted',
    'Rejected',
    'New Booking'
  ];

  constructor(public commonServices: CommonService) {
  }

  onTabClosed() {
    this.currentTabIndex = 100;
  }


  setStep(index: number) {
    console.log('current opened tab', index);
    this.currentTabIndex = index;
  }

  BOOKING_DATA: HostBookingDetails[] = [];


  myBookings(spaceId: string, callBack?: Function) {
    this.commonServices.presentLoading();
    const request = {
      action_url: '/spaces/bookings/' + spaceId,
      method: 'GET',
      params: {
        q: this.search_text,
        sort: 'category_id',
        order: 'asc',
        page: this.paginator ? this.paginator.pageIndex : 0,
        limit: 5
      }
    };
    console.log(request);

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.commonServices.dismissLoading();
        console.log('booking details', data);
        this.totalSizes = data.total_count;
        if (!data.items.length) {
          this.showData = true;
          return;
        }
        this.BOOKING_DATA.push(...data.items);

        if (callBack) {
          callBack();
        } else {
          this.SHOW_DATA = this.BOOKING_DATA.slice(0, this.pageSize);
        }
      },
      (err: any) => {
        this.commonServices.dismissLoading();
        console.log('Error', err);
      }
    );
    this.commonServices.dismissLoading();
  }

  ngOnInit() {
    if (this.spaceId)
      this.myBookings(this.spaceId);
    this.paginator.page.subscribe((page: PageEvent) => {
      console.log(page);

      const itemCount = page.pageIndex * this.pageSize;
      //if items to be displayed has length <= total items available
      if (itemCount <= this.totalSizes) {

        // if items range to be displayed is greater than current length of BOOKING_DATA we need to get data from server.
        if (this.BOOKING_DATA.length < itemCount + this.pageSize) {
          //passing callback function
          this.myBookings(this.spaceId, () => {
            console.log(itemCount);
            // if new array has more or equal items to this.pageSize to add
            if (itemCount + this.pageSize <= this.BOOKING_DATA.length) {
              console.log("sufficient Data");
              this.SHOW_DATA = this.BOOKING_DATA.slice(itemCount, itemCount + this.pageSize);
            } else {
              console.log("InSufficient Data........");
              this.SHOW_DATA.push(...this.BOOKING_DATA.slice(itemCount));
            }
          });
        } else {
          this.SHOW_DATA = this.BOOKING_DATA.slice(itemCount, itemCount + this.pageSize);
        }

        console.log(this.SHOW_DATA);
      }
    });
  }

}

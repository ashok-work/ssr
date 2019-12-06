import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDataService } from 'src/app/services/booking/booking-data.service';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit {

  activePage = 'pending';

  constructor(
    public commonServices: CommonService,
    public bookingService: BookingDataService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let params = this.route.params['value']

    if (params['path_name']) this.activePage = params['path_name'];
    else this.router.navigate(['my-bookings', 'pending']);
  }

  ngOnInit() {
    this.bookingService.currentBookingInfo = null;
  }

  selectPage(pageName) {
    this.router.navigate(['my-bookings', pageName]);
  }
}
import { Component, OnInit, HostListener } from '@angular/core';
import { BookingDataService } from '../../services/booking/booking-data.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (confirm("Be sure you have submitted the change !")) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    public bookingService: BookingDataService,
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle("Booking Preview");
  }

  ngOnInit() {
  }

}

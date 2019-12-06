import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { EventsType, SpaceType } from '../../interfaces/spaces';
import { CommonService } from '../../services/common-service/common.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BookingDataService } from '../../services/booking/booking-data.service';
import { BookingInfo } from 'src/app/interfaces/spaces';

declare var google: any;

@Component({
  selector: 'app-space-details',
  templateUrl: './space-details.component.html',
  styleUrls: ['./space-details.component.scss']
})
export class SpaceDetailsComponent implements OnInit {
  spaceId: string;
  bookingId: string;
  isAuthor = false;
  isBooking = false;
  pageNumber = 0;
  page = 0;
  showButton = true;
  isHost = false;

  stateCtrl = new FormControl();
  filteredStates: Observable<EventsType[]>;
  accesibility: Array<string>;
  amenities: Array<string>;
  spaceRules: Array<string>;
  cancellation: string;
  services: Array<string>;
  description: string;
  spaceDetails: Array<SpaceType>;
  events: EventsType[] = [];
  bookingData: any;
  location = [];
  images = [];
  showAllAmenities = false;
  showAllRules = false;
  showFullPolicy = false;
  showFullDesc = false;
  reviews: Array<Object> = [];
  loadingReviews = false;

  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  public _filterStates(value: string): EventsType[] {
    const filterValue = value.toLowerCase();

    return this.events.filter(state => state.occasion_name.toLowerCase().indexOf(filterValue) === 0);
  }
  constructor(
    public router: Router,
    public utils: UtilsService,
    public commonServices: CommonService,
    private bookingService: BookingDataService,
    public route: ActivatedRoute) {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.events.slice())
      );
    this.commonServices.presentLoading();
  }

  joinChat() {
    this.utils.join(this.spaceId, this.bookingData.user_id, this.bookingData.host_name)
  }

  destructureEvent(spaceInfo: Array<SpaceType>) {
    this.spaceDetails = spaceInfo;
    if (spaceInfo) {
      this.accesibility = spaceInfo['accessibility'];
      this.amenities = spaceInfo['amenities'];
      this.cancellation = spaceInfo['cancellation_policy'];
      this.description = spaceInfo['description'];
      this.services = spaceInfo['services'];
      this.spaceRules = spaceInfo['space_rules'];
      this.images = spaceInfo['images'];
      try {
        this.isAuthor = spaceInfo['user_id'] == this.utils.user.user_id;
      } catch (error) {
        console.log(error);
      }
    }

  }


  getSpaceDetails(spaceId: any) {
    if (spaceId) {
      const request = {
        action_url: '/spaces/' + spaceId,
        method: 'GET',
        params: {}
      };
      this.commonServices.doHttp(request).subscribe(
        (data: any) => {
          console.log(data);
          if (data["address"] && data['address'].lat && data['address'].lng) {
            this.location.push([data["address"].lat, data["address"].lng]);
          }
          if (this.location.length > 0) setTimeout(() => { this.renderMap(); }, 100);
          this.commonServices.dismissLoading();
          this.destructureEvent(data);
          this.bookingData = data;
          this.bookingData.cancellation_policy = this.bookingData.cancellation_policy;
          if (this.bookingData.catering_mandatory) this.bookingData.price = 0;
          this.bookingService.spaceBookingDetails = this.bookingData;
          this.setAnalytics();
          this.getReviews();
        },
        (err: any) => {
          this.commonServices.dismissLoading();
          console.log('Error', err);
        }
      );
      this.commonServices.dismissLoading();
    }
  }

  // loadMore() {
  //   this.pageNumber++;
  //   this.getReviews();
  // }

  async setAnalytics() {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.bookingData.space_id;
    analytics_props['spaceTitle'] = this.bookingData.name;
    analytics_props['spaceType'] = this.bookingData.space_kind;
    analytics_props['location'] = this.bookingData.address;
    try {
      const result = await this.utils.initApp();
      if (result) {
        const userProfile = this.utils.user;
        if(userProfile && userProfile.user_id) {
          analytics_props['userIdentifier'] = userProfile.user_id;
        } else {
          analytics_props['userIdentifier'] = "Anonymous";
        }
      }
    } catch(err) {
      analytics_props['userIdentifier'] = "Anonymous";
      console.log(err);
    }

    this.commonServices.addAnalytic({
      action: "SpaceDetailView",
      properties: analytics_props,
    });
  }

  getReviews(pageNumber?: any) {
    if (!pageNumber) pageNumber = 0;
    this.page = pageNumber;
    if (this.spaceId) {
      const request = {
        action_url: '/spaces/reviews/' + this.spaceId + '?page=' + pageNumber + '&pageSize=10',
        method: 'GET',
        params: {}
      };
      this.loadingReviews = true;
      this.commonServices.doHttp(request).subscribe(
        (data: Array<Object>) => {
          if (data != null && data.length > 0) {
            this.showButton = true;
            this.reviews = data;
          }
          else this.showButton = false;
          this.loadingReviews = false;
        },
        (error) => {
          this.commonServices.errorHandler(error);
          this.loadingReviews = false;
        }
      )
    }
  }

  getBookingDetails() {
    if (this.bookingId) {
      const request = {
        action_url: '/spaces/booking/' + this.bookingId,
        method: 'GET',
        params: {}
      };
      this.commonServices.doHttp(request).subscribe(
        (data: any) => {
          if (data["address"] && data['address'].lat && data['address'].lng) {
            this.location.push([data["address"].lat, data["address"].lng]);
          }
          if (this.location.length > 0) setTimeout(() => { this.renderMap(); }, 100);
          this.destructureEvent(data);
          this.bookingData = data;
          this.bookingData.cancellation_policy = this.bookingData.cancellation_policy;
          if (this.bookingData.catering_mandatory) this.bookingData.price = 0;
          this.bookingService.spaceBookingDetails = this.bookingData;

          let body: BookingInfo = {
            space_id: data.space_id,
            capacity: data.capacity,
            guests: data.guests,
            event_start_date: data.event_start_date,
            event_end_date: data.event_end_date ? data.event_end_date : undefined,
            is_cancelled: false,
            grand_total: data.total_amount,
            sub_total: data.sub_total,
            service_fee: data.guest_service_fee,
            gst: data.tax,
            cart: data.catering,
            cart_total: data.catering_amount,
            discount: data.sub_total > 0 ? data.discount_amount : 0,
            cart_discount: data.catering_amount > 0 ? data.discount_amount : 0,
            booking_id: data.booking_id,
            coupon: data.coupon,
          };
          this.bookingService.currentBookingInfo = body;
          this.commonServices.dismissLoading();
        },
        (err: any) => {
          this.commonServices.dismissLoading();
        }
      );
    }
  }

  getHostBookingDetails() {
    if (this.bookingId) {
      const request = {
        action_url: '/spaces/host/' + this.bookingId,
        method: 'GET',
        params: {}
      };

      this.commonServices.doHttp(request).subscribe(
        (data: any) => {
          if (data["address"] && data['address'].lat && data['address'].lng) {
            this.location.push([data["address"].lat, data["address"].lng]);
          }
          if (this.location.length > 0) setTimeout(() => { this.renderMap(); }, 100);
          this.destructureEvent(data);
          this.bookingData = data;
          this.bookingData.cancellation_policy = this.bookingData.cancellation_policy;
          if (this.bookingData.catering_mandatory) this.bookingData.price = 0;
          this.bookingService.spaceBookingDetails = this.bookingData;
          let body: BookingInfo = {
            space_id: data.space_id,
            capacity: data.capacity,
            guests: data.guests,
            event_start_date: data.event_start_date,
            event_end_date: data.event_end_date ? data.event_end_date : undefined,
            is_cancelled: false,
            grand_total: data.outstanding_amount,
            sub_total: data.sub_total,
            service_fee: data.host_service_fee,
            gst: data.tax,
            cart: data.catering,
            discount: data.sub_total > 0 ? data.discount_amount : 0,
            cart_discount: data.catering_amount > 0 ? data.discount_amount : 0,
            booking_id: data.booking_id,
            coupon: data.coupon,
          };

          this.bookingService.currentBookingInfo = body;
          this.isHost = true;
          this.commonServices.dismissLoading();
        },
        err => {
          this.commonServices.dismissLoading();
        }
      );
    }
  }

  renderMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      maxZoom: 14,
      center: new google.maps.LatLng(this.location[0][0], this.location[0][1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var circle = new google.maps.Circle({
      map: map,
      center: new google.maps.LatLng(this.location[0][0], this.location[0][1]),
      radius: 2000,
      strokeColor: '#fe6e33',
      strokeOpacity: 0.9,
      strokeWeight: 1,
      fillColor: '#fe6e33',
      fillOpacity: 0.6,
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.route.params.subscribe((param) => {
      console.log(param);
      if (param['spaceId']) {
        this.commonServices.setTitle('Space Details');
        this.spaceId = param['spaceId'];
        if (this.spaceId) {
          this.bookingService.spaceId.next(this.spaceId);
          this.getSpaceDetails(this.spaceId);
        }
      } else if (param['bookingId']) {
        this.commonServices.setTitle('Booking Details');
        this.isBooking = true;
        this.bookingId = param['bookingId'];
        this.getBookingDetails();
      } else if (param['hostBookingId']) {
        this.commonServices.setTitle('Host Booking Details');
        this.isBooking = true;
        this.bookingId = param['hostBookingId'];
        this.getHostBookingDetails();
      }
    });

  }


  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

}

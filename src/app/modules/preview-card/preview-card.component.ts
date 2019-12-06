import { Component, OnInit, Input } from '@angular/core';
import { BookingDataService } from '../../services/booking/booking-data.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {

  @Input() isHost: any;
  couponCode: any;
  couponApplied = false;
  couponAmount: any;
  couponDesc: any;

  constructor(
    public bookingService: BookingDataService,
    public utils: UtilsService,
    public commonServices: CommonService,
  ) {
    // console.log(this.bookingService.currentBookingInfo.capacity);

  }

  ngOnInit() {
    if (this.bookingService.currentBookingInfo.booking_id) return;
    if (!this.bookingService.currentBookingInfo.cart_discount) this.bookingService.currentBookingInfo.cart_discount=0;
    if (this.bookingService.currentBookingInfo.cart_total) {
      this.bookingService.currentBookingInfo.service_fee = (this.bookingService.currentBookingInfo.service_tax / 100.0) * (Number(this.bookingService.currentBookingInfo.sub_total_after_discount) + Number(this.bookingService.currentBookingInfo.cart_total_after_discount));
      this.bookingService.currentBookingInfo.gst = (this.bookingService.currentBookingInfo.gst_tax / 100.0) * (Number(this.bookingService.currentBookingInfo.sub_total_after_discount) + Number(this.bookingService.currentBookingInfo.cart_total_after_discount));
      this.bookingService.currentBookingInfo.grand_total_before_coupon = this.bookingService.currentBookingInfo.sub_total_after_discount + this.bookingService.currentBookingInfo.cart_total_after_discount + this.bookingService.currentBookingInfo.service_fee + this.bookingService.currentBookingInfo.gst;
    } else {
      this.bookingService.currentBookingInfo.service_fee = (this.bookingService.currentBookingInfo.service_tax / 100.0) * Number(this.bookingService.currentBookingInfo.sub_total_after_discount);
      this.bookingService.currentBookingInfo.gst = (this.bookingService.currentBookingInfo.gst_tax / 100.0) * Number(this.bookingService.currentBookingInfo.sub_total_after_discount);
      this.bookingService.currentBookingInfo.grand_total_before_coupon = this.bookingService.currentBookingInfo.sub_total_after_discount + this.bookingService.currentBookingInfo.service_fee + this.bookingService.currentBookingInfo.gst;
    }
    this.bookingService.currentBookingInfo.grand_total = this.bookingService.currentBookingInfo.grand_total_before_coupon;
    if (!this.bookingService.currentBookingInfo.cart_added) {
      this.bookingService.currentBookingInfo.cart_added = true;
    }
  }

  applyCoupon() {
    let total_minus_tax = this.bookingService.currentBookingInfo.grand_total_before_coupon - this.bookingService.currentBookingInfo.gst - this.bookingService.currentBookingInfo.service_fee;
    const request = {
      action_url: `/coupon?coupon_code=${this.couponCode}&total=${total_minus_tax}`,
      method: 'GET',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        console.log(data);
        if(data.status) {
          this.setCouponData(data);
        } else {
          this.resetCouponData();
        }
        this.commonServices.dismissLoading();
      },
      err => {
        this.resetCouponData();
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    );
  }

  setCouponData(data) {
    let elem = document.getElementById('couponError');
    elem.classList.add('d-none');
    this.couponApplied = true;
    this.couponAmount = data.discount_amount;
    this.couponDesc = data.coupon_desc;
    this.bookingService.currentBookingInfo.grand_total -= this.couponAmount;
    this.bookingService.currentBookingInfo.coupon = data;
  }

  resetCouponData(flag?: any) {
    if(!flag) {
      let elem = document.getElementById('couponError');
      elem.classList.remove('d-none');
    }
    this.couponApplied = false;
    this.couponAmount = 0;
    this.couponDesc = "";
    this.bookingService.currentBookingInfo.grand_total = this.bookingService.currentBookingInfo.grand_total_before_coupon;
    this.bookingService.currentBookingInfo.coupon = null;
  }

}

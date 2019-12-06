import { Component, OnInit, HostListener } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { CommonService } from "src/app/services/common-service/common.service";
import { BookingDataService } from "../../../services/booking/booking-data.service";
import { Router } from "@angular/router";
import { UtilsService } from "src/app/services/utils/utils.service";
import { AlertController } from "@ionic/angular";
declare var Razorpay: any;

@Component({
  selector: "make-razorpay-payment",
  templateUrl: "./make-payment.component.html",
  styleUrls: ["./make-payment.component.scss"]
})
export class MakePaymentComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (confirm("Be sure you have submitted the change !")) {
      return true;
    } else {
      return false;
    }
  }
  rzp: any;
  razor_pay_data: any;
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  couponFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  constructor(
    public commonServices: CommonService,
    public router: Router,
    public bookingService: BookingDataService,
    public utils: UtilsService,
    public services: CommonService,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getRazorPayToken();
  }

  private getTotal() {
    return this.bookingService.currentBookingInfo.grand_total > 1 ? this.bookingService.currentBookingInfo.grand_total * 100 : Math.round(this.bookingService.currentBookingInfo.grand_total) * 100;
  }

  roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);
    }
    return n;
  }

  async getRazorPayToken() {
    const request = {
      action_url: '/payment/charge/token',
      method: 'GET',
      params: {},
    }

    this.commonServices.presentLoading();
    try {
      let response: any = await this.commonServices.doHttp(request).toPromise();
      this.razor_pay_data = response;
    }
    catch (err) {
      console.log(err);
    }
    finally {
      this.commonServices.dismissLoading();
    }
  }

  public openRazorPay() {
    const prefill = {};
    console.log("this.utils.user", this.utils.user);
    if (this.utils.user["user_json"]) {
      if (this.utils.user["user_json"].hasOwnProperty("fullName")) {
        prefill["name"] = this.utils.user["user_json"]["fullName"];
      }
      if (this.utils.user["user_json"].hasOwnProperty("firstName")) {
        prefill["firstName"] = this.utils.user["user_json"]["firstName"];
      }
      if (this.utils.user["user_json"].hasOwnProperty("lastName")) {
        prefill["lastName"] = this.utils.user["user_json"]["lastName"];
      }
      if (this.utils.user.hasOwnProperty("email")) {
        prefill["email"] = this.utils.user["email"];
      }
      if (this.utils.user.hasOwnProperty("mobile")) {
        prefill["contact"] = this.utils.user["mobile"];
      }
    }

    // 2000 paise = INR 20
    const options = {
      key: this.razor_pay_data.token,
      amount: this.roundTo(this.bookingService.currentBookingInfo.grand_total, 2) * 100,
      name: this.razor_pay_data.name,
      description: this.razor_pay_data.description,
      image: this.razor_pay_data.image,
      handler: response => {
        this.bookingService.currentBookingInfo.razorpay_payment_id =
          response.razorpay_payment_id;
        console.log(response.razorpay_payment_id);
        this.onetimePayment();
        // this.bookSpace();
      },
      prefill: prefill,
      notes: {
        space_id: this.bookingService.currentBookingInfo.space_id,
        space_name: this.bookingService.currentBookingInfo.space_name,
        event_start_date: this.bookingService.currentBookingInfo.event_start_date,
        event_end_date: this.bookingService.currentBookingInfo.event_end_date,
        guests: this.bookingService.currentBookingInfo.guests,
        total: this.bookingService.currentBookingInfo.grand_total,
        date: new Date().toString(),
        user_id: this.utils.user.user_id,
      },
      theme: {
        color: this.razor_pay_data.color
      }
    };
    this.rzp = new Razorpay(options);
    this.rzp.open();
  }

  bookSpace() {
    this.commonServices.presentLoading();
    const request = {
      action_url: "/spaces/booking",
      method: "POST",
      params: this.bookingService.currentBookingInfo
    };
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.commonServices.dismissLoading();
        console.log("space details", data);
        this.commonServices.notification(data["msg"]);
        this.router.navigate(["/"]);
      },
      (err: any) => {
        this.commonServices.dismissLoading();
        console.log("Error", err);
        this.commonServices.notification("Unable to book space");
      }
    );
    this.commonServices.dismissLoading();
  }

  /**
   * onetime payment
   */
  private onetimePayment() {
    const params = {
      razorpay_payment_id: this.bookingService.currentBookingInfo
        .razorpay_payment_id,
      amount: this.roundTo(this.bookingService.currentBookingInfo.grand_total, 2) * 100,
      sub_total: this.bookingService.currentBookingInfo.sub_total,
      tax: this.bookingService.currentBookingInfo.gst,
      service_fee: this.bookingService.currentBookingInfo.service_fee,
      grand_total: this.bookingService.currentBookingInfo.grand_total,
      // address: this.userService.selected_address,
      space_id: this.bookingService.currentBookingInfo.space_id,
      guests: this.bookingService.currentBookingInfo.guests,
      event_start_date: this.bookingService.currentBookingInfo.event_start_date,
      event_end_date: this.bookingService.currentBookingInfo.event_end_date,
      coupon_code: this.bookingService.currentBookingInfo.coupon,
      occasion_name: this.bookingService.currentBookingInfo.occasion_name,
      cart: this.bookingService.currentBookingInfo.cart,
      cart_total: this.bookingService.currentBookingInfo.cart_total,
      space_discount: this.bookingService.currentBookingInfo.discount,
      cart_discount: this.bookingService.currentBookingInfo.cart_discount,
      discount: Number(this.bookingService.currentBookingInfo.discount) + Number(this.bookingService.currentBookingInfo.cart_discount),
      coupon: this.bookingService.currentBookingInfo.coupon,
    };

    const request = {
      action_url: "/payment/charge/onetime",
      method: "POST",
      params: params
    };
    console.log("onetime", request);
    this.services.presentLoading();
    this.services.doHttp(request).subscribe(
      data => {
        this.services.dismissLoading();
        this.setAnalytics();
        this.showConfirmation();
      },
      err => {
        this.services.dismissLoading();
        console.log("Error", err);
        this.services.errorHandler(err);
      }
    );
  }

  async setAnalytics() {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.bookingService.currentBookingInfo.space_id;
    analytics_props['bookingDate'] = this.bookingService.currentBookingInfo.event_start_date;
    analytics_props['subTotal'] = this.bookingService.currentBookingInfo.sub_total_after_discount;
    analytics_props['total'] = this.bookingService.currentBookingInfo.grand_total;
    analytics_props['pricingType'] = this.bookingService.currentBookingInfo.cart_total <= 0 ? 'hourly' : 'package';
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
      action: "CompletePayment",
      properties: analytics_props,
    });
  }

  async showConfirmation() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your booking was successful. Click OK to go to Your Bookings.',
      buttons: [
        {
          'text': 'OK',
          'role': 'cancel',
          'cssClass': '',
          'handler': (data) => {

          }
        },
      ]
    });

    await alert.present();

    alert.onDidDismiss().then((data) => {
      this.router.navigate(["/my-bookings/pending"])
    });
  }
}

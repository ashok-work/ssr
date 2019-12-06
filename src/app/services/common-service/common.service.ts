import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie";
// import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute, Params } from "@angular/router";
import swal from "sweetalert2";
import { Subject } from "rxjs";

import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { LoadingController, ToastController } from "@ionic/angular";

import { ComponentPortal } from "@angular/cdk/portal";
import { MatSpinner } from "@angular/material";
import { MatSnackBar } from "@angular/material";

import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import { Title } from "@angular/platform-browser";

declare const mixpanel: any;

@Injectable()
export class CommonService {
  /**
   * site information object
   */
  public info = environment;
  public passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  public phonenoRegex = /^\d{10}$/;
  public emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  public loader: any;
  public otp_response: any = {};
  public showOverlay = new Subject<boolean>();
  public showLoader = false;
  public selected_carrier_code: any = null;

  ///for stripe
  order_disable = true;

  public spinnerTopRef: any;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    private overlay: Overlay,
    public cookieService: CookieService,
    public snackBar: MatSnackBar,
    public loadingController: LoadingController,
    public titleService: Title,
    public toastController: ToastController
  ) // public notify: NotificationsService
  {
    console.log("new config", JSON.stringify(this.info));
  }

  loadGMaps() {
    let node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.map_key + '&libraries=places&language=en';
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  public setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  public addAnalytic(params) {
    console.log("addAnalytic", params);
    if (environment.production) {
      // this.angulartics2Mixpanel.eventTrack(params['action'], params['properties']);
      try {
        mixpanel.track(params["action"], params["properties"]);
      } catch (err) {
        console.log(err);
      }
    }
  }

  getCLDRCode(val) {
    const data = environment.countries.filter(country => {
      return country["iso"] === val;
    });
    if (data && data.length > 0) {
      return data[0]["cldr"].toUpperCase();
    } else {
      return this.info["country_code"].toUpperCase();
    }
  }

  validatePhoneNumber(data) {
    if (data) {
      if (!this.isValidPhoneNumber(data)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  public isValidPhoneNumber(phone) {
    console.log(phone);
    const county_code = this.selected_carrier_code
      ? this.selected_carrier_code
      : this.info["country_code"].toUpperCase();
    const phoneNumber = parsePhoneNumberFromString(
      `Phone: ${phone}`,
      county_code
    );
    if (phoneNumber) {
      console.log("phoneNumber.getType()", phoneNumber.getType());
      console.log("phoneNumber.isValid()", phoneNumber.isValid());
      return phoneNumber.isValid();
    } else {
      return false;
    }
  }

  public getAsYouTypeNumber(phone) {
    const county_code = this.selected_carrier_code
      ? this.selected_carrier_code
      : this.info["country_code"].toUpperCase();
    return new AsYouType(county_code).input(phone);
  }

  public getPhoneDetails(phone) {
    const county_code = this.selected_carrier_code
      ? this.selected_carrier_code
      : this.info["country_code"].toUpperCase();
    const phoneNumber = parsePhoneNumberFromString(
      `Phone: ${phone}`,
      county_code
    );
    console.log("phoneNumber", phoneNumber);
    return {
      formatInternational: phoneNumber.formatInternational(),
      nationalNumber: phoneNumber.nationalNumber
    };
  }

  public cdkSpinnerCreate() {
    this.spinnerTopRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: "dark-backdrop",
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  getLocalTime(dateStr: string) {
    const newDate = new Date(dateStr).toString();
    return newDate;
  }

  getEventImg(event) {
    if (event["event_image"]) {
      if ("image_file" in event["event_image"]) {
        return event["event_image"]["image_file"];
      } else {
        return event["image"];
      }
    } else {
      if (event["image"]) {
        return event["image"];
      } else {
        return "assets/dummyimg2.jpg";
      }
    }
  }

  errorImg(event) {
    event.target.src = "assets/dummyimg2.jpg";
  }

  getDateFormat(date_params) {
    let date: any = new Date(date_params);
    date =
      date.getUTCFullYear() +
      "-" +
      ("00" + (date.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getUTCDate()).slice(-2) +
      " " +
      ("00" + date.getUTCHours()).slice(-2) +
      ":" +
      ("00" + date.getUTCMinutes()).slice(-2) +
      ":" +
      ("00" + date.getUTCSeconds()).slice(-2);
    return date;
  }

  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * goto top
   */
  public gotoTop() {
    window.scrollTo(0, 0);
  }

  async notification(msg: string, extra?: any) {
    /*
    this.snackBar.open(msg, undefined, {
      duration: 2000,
    });
    */
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  /**
   * notification
   */
  public notifyMsg(msg: string, type?: any) { }

  /**
   * show loading
   */
  async presentLoading() {
    /*
      // this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
      if (!this.loader) {
        this.loader = await this.loadingController.create({
          message: 'Please Wait...'
        });
      }
      await this.loader.present();
    */
    this.showLoader = true;
  }

  /**
   * dismiss loading
   */
  public dismissLoading() {
    /*
      // this.spinnerTopRef.detach();
      if (this.loader) {
        this.loader.dismiss();
      }
      // debugger;
    */
    this.showLoader = false;
  }

  /**
   * Error Handle for Api calss
   */
  public errorHandler(response: Object) {
    console.log(response);
    if (response["status"] === 409) {
      this.notification("Email/mobile no already exists");
    } else if (response["status"] === 401) {
      this.notification("Session expired");
      this.forceLogout();
    } else {
      if ("error" in response) {
        try {
          const err_res = response["error"];
          console.log(err_res);
          if ("message" in err_res) {
            this.notification(err_res["message"]);
          } else if ("msg" in err_res) {
            this.notification(err_res["msg"]);
          } else {
            this.notification(err_res["status"]);
          }
        } catch (e) { }
      }
    }
  }

  public forceLogout() {
    this.cookieService.remove(environment["user"]);
    this.cookieService.remove(environment["token"]);
    this.router.navigate(["/login"]);
  }

  isEmptyObject(obj: { [key: string]: string }) {
    return Object.keys(obj).length === 0;
  }

  public emailMobileValidation(params) {
    const email = params["email"];
    if (this.emailRegex.test(email)) {
      return true;
    } else if (this.phonenoRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  public checkUserMobilenoHandler(params) {
    const self = this;
    // self.otp_response = {};
    const request = {
      action_url: "/sms/validate_new_account",
      method: "GET",
      params: params
    };
    return new Promise(function (resolve, reject) {
      self.doHttp(request).subscribe(
        data => {
          self.otp_response = data;
          resolve(data);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public sendOtpHandler(params) {
    const self = this;
    const request = {
      action_url: "/sms/sendverification",
      method: "POST",
      params: params
    };
    return new Promise(function (resolve, reject) {
      self.doHttp(request).subscribe(
        data => {
          self.otp_response = data;
          resolve(data);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public verifyOtpHandler(params) {
    const self = this;
    if (self.otp_response.hasOwnProperty("Details")) {
      params["details"] = self.otp_response["Details"];
    }
    const request = {
      action_url: "/sms/checkVerification",
      method: "GET",
      params: params
    };
    return new Promise(function (resolve, reject) {
      self.doHttp(request).subscribe(
        (data: any) => {
          self.otp_response = {};
          resolve(data);
        },
        (err: any) => {
          console.log(err);
          self.errorHandler(err);
          reject(err);
        }
      );
    });
  }

  public getCurrency() {
    const country: any = this.cookieService.get("country");
    if (country === "in") {
      this.info["currency"] = "₹";
    }
  }

  public validateEmail(email: string) {
    return this.emailRegex.test(email);
  }

  public validateMobile(mobile: string) {
    return this.phonenoRegex.test(mobile);
  }

  public getExtension(filename: string) {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  }

  isImage(filename: string) {
    const ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "png":
        return true;
    }
    return false;
  }

  isVideo(filename: string) {
    const ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case "m4v":
      case "avi":
      case "mpg":
      case "mp4":
        // etc
        return true;
    }
    return false;
  }

  public getUniqId() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public getToken() {
    const user_token = this.cookieService.get(environment["token"]);
    return user_token;
    /*
    console.log(user_token);
    if (user_token) {
      const token = JSON.parse(user_token);
      if ('user_token' in token) {
        return token['user_token'];
      } else {
        return false;
      }
    } else {
      return false;
    }
    */
  }

  /**
   * Service calls(POST,GET,PUT,DELETE)
   */
  public doHttp(request) {
    console.log(request);
    const user_token = this.getToken();
    console.log(user_token);
    let headers = new HttpHeaders();
    headers = headers.append("App-Scope", this.info["scope"]);
    if (request.file) {
      // headers = headers.append('Content-Type', undefined);
    } else {
      headers = headers.append("Content-Type", "application/json");
    }
    if (user_token) {
      headers = headers.append("user_token", user_token);
    }
    // get request
    if (request.method === "GET") {
      let httpParams = new HttpParams();
      Object.keys(request["params"]).forEach(key => {
        httpParams = httpParams.append(key, request["params"][key]);
      });
      const queryString = httpParams.toString();
      const params = queryString === "" ? "" : "?" + queryString;
      // console.log(params);
      return this.http.get(
        this.info["service_url"] +
        this.info["api_prefix"] +
        request.action_url +
        params,
        { headers: headers }
      );
    } else if (request.method === "POST") {
      return this.http.post(
        this.info["service_url"] + this.info["api_prefix"] + request.action_url,
        JSON.stringify(request.params),
        {
          headers: headers
        }
      );
    } else if (request.method === "PUT") {
      if (request.file) {
        return this.http.put(
          this.info["service_url"] +
          this.info["api_prefix"] +
          request.action_url,
          request.params,
          {
            headers: headers
          }
        );
      } else {
        return this.http.put(
          this.info["service_url"] +
          this.info["api_prefix"] +
          request.action_url,
          JSON.stringify(request.params),
          {
            headers: headers
          }
        );
      }
    } else if (request.method === "DELETE") {
      return this.http.delete(
        this.info["service_url"] + this.info["api_prefix"] + request.action_url,
        { headers: headers }
      );
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CustomValidators } from "ngx-custom-validators";
import { AlertController } from "@ionic/angular";
import { CommonService } from "src/app/services/common-service/common.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  form: FormGroup;
  prevEmail = false;
  valid_email = true;
  formData;
  showPassword = false;
  otp_alert: any = null;
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public services: CommonService,
    public utilsService: UtilsService,
    public alertController: AlertController,
    private router: Router
  ) {
    /**
     * Registration form
     * @type {FormGroup}
     */
    this.services.setTitle('Signup');
    const password = new FormControl("", [
      Validators.required,
      Validators.minLength(6)
    ]);
    // const cpassword = new FormControl('', [Validators.minLength(6), CustomValidators.equalTo(password)]);

    this.form = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      password: password,
      carrier_code: new FormControl(
        this.services.info["carrier_code"].toUpperCase(),
        []
      )
      // 'cpassword': cpassword
    });
    // this.services.disableMenu();
  }

  formReset() {
    this.form.reset();
    this.form.controls.carrier_code.setValue(
      this.services.info["carrier_code"].toUpperCase()
    );
    this.validatePhoneEmail();
  }

  ionViewDidEnter() {
    this.formReset();
  }

  toggleShowPwd() {
    this.showPassword = !this.showPassword;
  }

  countryChange(event) {
    this.form.patchValue({
      carrier_code: event.toString()
    });
    console.log(this.form.value);
    if (this.form.value.carrier_code) {
      this.services.selected_carrier_code = this.form.value.carrier_code;
      // this.validatePhoneNumber();
    }
  }

  validatePhoneEmail() {
    const pattern = /^\d+$/;
    if (!this.form.value.email) {
      this.isMobile = false;
    } else if (this.services.emailRegex.test(this.form.value.email)) {
      this.isMobile = false;
    } else if (pattern.test(this.form.value.email)) {
      // this.validatePhoneNumber();
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  validatePhoneNumber() {
    const data = this.form.get("email").value;
    if (this.services.validatePhoneNumber(data)) {
      this.form.get("email").setValue(this.services.getAsYouTypeNumber(data));
      return true;
    } else {
      return false;
    }
  }

  validateEmail(event: any) {
    const email = this.form.value.email;
    console.log("email value", email);
    if (this.services.emailRegex.test(email)) {
      this.isValidEmail(email);
    }
  }

  isValidEmail(email) {
    console.log(email !== this.prevEmail);
    if (email !== this.prevEmail) {
      this.services.presentLoading();
      this.prevEmail = email;
      const request = {
        action_url: "/user/isvalidemail",
        method: "GET",
        params: {
          email: email
        }
      };
      this.services.doHttp(request).subscribe(
        data => {
          this.services.dismissLoading();
          console.log("valid email", data);
          this.valid_email = true;
        },
        err => {
          this.services.dismissLoading();
          console.log("Error", err);
          if (err.status === 400) {
            this.valid_email = false;
          }
        }
      );
    }
  }

  /**
   * submit register form
   */
  submitForm(value) {
    if (this.form.valid) {
      console.log(value);
      this.formData = value;
      if ("mobile" in this.formData) {
        this.form.controls["email"].setValue(this.formData["mobile"]);
        // delete this.formData['mobile'];
      }
      console.log("form values", this.formData);
      if (this.services.emailRegex.test(this.formData["email"])) {
        this.registerHandler();
      } else if (this.services.isValidPhoneNumber(this.formData["email"])) {
        this.services.presentLoading();
        const mobile = this.formData["email"];
        this.formData["mobile"] = this.services.getPhoneDetails(mobile)[
          "nationalNumber"
        ];
        this.services
          .checkUserMobilenoHandler({
            mobile: this.formData["mobile"],
            carrier_code: this.formData.carrier_code
          })
          .then(
            response => {
              this.services.dismissLoading();
              this.services.notification(response["message"], true);
              this.otpAlert();
            },
            err => {
              this.services.dismissLoading();
              this.services.errorHandler(err);
            }
          );
      } else {
        this.services.notification("Enter Valid Email/Mobile", false);
      }
    } else {
      console.log("invalid");
      this.services.markFormGroupTouched(this.form);
    }
  }

  registerHandler() {
    console.log(this.formData);
    let analytics_props = null;
    const request = {
      action_url: "/user/register",
      method: "POST",
      params: {
        user_json: {
          first_name: this.formData["firstName"],
          last_name: this.formData["lastName"]
        },
        email: this.formData["email"],
        password: this.formData["password"],
        mobile: this.formData["mobile"]
      }
    };
    if (this.services.emailRegex.test(this.formData["email"])) {
      request["params"]["email"] = this.formData["email"];
      request["params"]["mobile"] = "";
      analytics_props = {
        method: 'Email',
        value: this.formData["email"]
      };
    } else if (this.services.phonenoRegex.test(this.formData["email"])) {
      request["params"]["mobile"] = this.formData["email"];
      request['params']['carrier_code'] = this.formData['carrier_code'];
      request["params"]["email"] = "";
      analytics_props = {
        method: 'Mobile',
        value: this.formData["email"]
      };
    } else {
      this.services.notification("Enter Valid Email/Mobile", false);
      return false;
    }
    this.services.presentLoading();
    this.services.doHttp(request).subscribe(
      data => {
        this.services.dismissLoading();
        this.formReset();
        this.utilsService.setCookie(
          this.utilsService.config["token"],
          data["user_token"]
        );
        this.utilsService.user_token = data["user_token"];
        this.services.notifyMsg("Registration successfully", true);
        this.utilsService.getUserDetails(true);
        // Mix Panel Analytics
        analytics_props['success'] = true;
        // this.services.addAnalytic({
        //   action: "Signup",
        //   properties: analytics_props
        // });
      },
      err => {
        this.formReset();
        this.services.dismissLoading();
        console.log("Error", err);
        this.services.errorHandler(err);
        // Mix Panel Analytics
        analytics_props['success'] = false;
        // this.services.addAnalytic({
        //   action: "Signup",
        //   properties: analytics_props
        // });
      }
    );
  }

  async otpAlert() {
    this.otp_alert = await this.alertController.create({
      header: "OTP!",
      backdropDismiss: false,
      inputs: [
        {
          name: "otp",
          type: "number",
          placeholder: "Enter Verification Code"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "danger",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Resend",
          cssClass: "secondary",
          handler: () => {
            console.log("reset data");
            this.resendOtp();
            return false;
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log(data);
            console.log("Confirm Ok");
            if (data["otp"]) {
              this.submitOtpForm(data["otp"]);
              return false;
            } else {
              this.services.notification("Enter Verification Code");
              return false;
            }
          }
        }
      ]
    });
    await this.otp_alert.present();
  }

  resendOtp() {
    this.services.presentLoading();
    this.services
      .sendOtpHandler({
        mobile: this.formData["mobile"],
        carrier_code: this.formData["carrier_code"]
      })
      .then(
        response => {
          this.services.dismissLoading();
          this.services.notification(response["message"], true);
          console.log(response);
        },
        err => {
          this.services.dismissLoading();
          this.services.errorHandler(err);
        }
      );
  }

  submitOtpForm(verification_code) {
    this.services.presentLoading();
    this.services
      .verifyOtpHandler({
        mobile: this.formData["mobile"],
        verification_code: verification_code,
        carrier_code: this.formData["carrier_code"]
      })
      .then(
        response => {
          console.log(response);
          this.services.dismissLoading();
          if (this.otp_alert) {
            this.otp_alert.dismiss();
          }
          this.services.notifyMsg("Mobile verified successfully", true);
          this.formData["email"] = this.formData["mobile"];
          this.registerHandler();
        },
        err => {
          this.services.dismissLoading();
          // this.services.smsErrorHandler(err);
        }
      );
  }

  ngOnInit() { }
}

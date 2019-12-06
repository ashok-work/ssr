import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { CommonService } from "src/app/services/common-service/common.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
    selector: "app-magiclink",
    templateUrl: "./magiclink.component.html",
    styleUrls: ["./magiclink.component.scss"]
})
export class MagiclinkComponent implements OnInit, OnDestroy {
    form: FormGroup;
    formData;
    otp_alert: any = false;
    isMobile = false;

    constructor(
        public fb: FormBuilder,
        public route: ActivatedRoute,
        public router: Router,
        public services: CommonService,
        public alertController: AlertController,
        public utilsService: UtilsService,
        private location: Location
    ) {
        this.services.setTitle('Magic Link');
        this.form = this.fb.group({
            email: [null, Validators.compose([Validators.required])],
            carrier_code: [this.services.info["carrier_code"].toUpperCase()]
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

    countryChange(event) {
        this.form.patchValue({
            carrier_code: event.toString()
        });
        console.log(this.form.value);
        if (this.form.value.carrier_code) {
            this.services.selected_carrier_code = this.form.value.carrier_code;
            /*
            if (this.form.valid && this.validatePhoneNumber()) {
              this.form.controls.email.setValue(
                this.services.getAsYouTypeNumber(this.form.value.email)
              );
            }
            */
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
        if (!this.services.validatePhoneNumber(data)) {
            return false;
        } else {
            this.form.get("email").setValue(this.services.getAsYouTypeNumber(data));
            return true;
        }
    }

    /**
     * submit Forgot Password Form
     */
    submitForm() {
        if (this.form.valid) {
            this.formData = this.form.value;
            this.sendMagicLinkHandler();
        } else {
            this.services.markFormGroupTouched(this.form);
        }
    }

    sendMagicLinkHandler() {
        const request = {
            action_url: "/magiclink",
            method: "POST",
            params: {}
        };
        if (this.services.emailRegex.test(this.formData["email"])) {
            request["params"]["email"] = this.formData["email"];
        } else if (this.services.isValidPhoneNumber(this.formData["email"])) {
            request["params"]["carrier_code"] = this.formData["carrier_code"];
            request["params"]["mobile"] = this.formData["email"];
        } else {
            this.services.notification("Enter Valid Email/Mobile", false);
            return false;
        }
        this.services.presentLoading();
        this.services.doHttp(request).subscribe(
            data => {
                console.log(data);
                // this.formReset();
                this.services.dismissLoading();
                this.services.notification(data["status"], true);
                if ("mobile" in request["params"]) {
                    this.otpAlert(this.formData);
                } else {
                    this.location.back();
                }
            },
            err => {
                this.services.dismissLoading();
                // this.form.reset();
                console.log("Error", err);
                this.services.errorHandler(err);
            }
        );
    }

    async otpAlert(form) {
        this.otp_alert = await this.alertController.create({
            header: "Verification Code!",
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
                        form.reset();
                    }
                },
                {
                    text: "Resend",
                    cssClass: "secondary",
                    handler: () => {
                        console.log("reset data");
                        this.sendMagicLinkHandler();
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

    submitOtpForm(verification_code) {
        this.services.presentLoading();
        const request = {
            action_url: "/magiclink/" + verification_code,
            method: "GET",
            params: {}
        };
        this.services.doHttp(request).subscribe(
            data => {
                console.log(data);
                this.services.dismissLoading();
                if (this.otp_alert) {
                    this.otp_alert.dismiss();
                }
                this.loginHandler(data);
            },
            err => {
                this.services.dismissLoading();
                this.services.errorHandler(err);
            }
        );
    }

    loginHandler(data) {
        this.utilsService.setCookie(
            this.utilsService.config["token"],
            data.user_token
        );
        this.utilsService.user_token = data.user_token;
        this.services.notifyMsg("Login Successfully", true);
        this.utilsService.getUserDetails(true);
    }

    /**
     * check token and get email
     */
    checkToken(token) {
        const request = {
            action_url: "/magiclink/" + token,
            method: "GET",
            params: {}
        };
        this.services.doHttp(request).subscribe(
            data => {
                // this.loading = false;
                console.log(data);
                this.loginHandler(data);
            },
            err => {
                // this.loading = false;
                console.log("Error", err);
                this.services.errorHandler(err);
            }
        );
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log("params", params);
            if ("token" in params) {
                this.checkToken(params["token"]);
            }
        });
    }

    ngOnDestroy() {
        // this.form.reset();
    }
}

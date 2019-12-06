import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { CommonService } from "src/app/services/common-service/common.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
    selector: "app-forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    formData;
    otp_alert: any = false;
    isMobile = false;

    constructor(
        public fb: FormBuilder,
        public services: CommonService,
        public alertController: AlertController,
        private router: Router,
        private location: Location,
        private utilsService: UtilsService
    ) {
        this.services.setTitle('Forgot Password');
        this.form = new FormGroup({
            email: new FormControl("", [Validators.required]),
            carrier_code: new FormControl(
                this.services.info["carrier_code"].toUpperCase(),
                []
            )
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
            this.form.controls.email.setValue(
              this.form.value.email ? this.form.value.email.replace(/\s/g, "") : null
            );
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
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }

    validatePhoneNumber() {
        const data = this.form.get("email").value;
        if (this.services.validatePhoneNumber(data)) {
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
            this.sendForgot(this.form);
        } else {
            this.services.markFormGroupTouched(this.form);
        }
    }

    async otpAlert(form) {
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
                        this.formReset();
                    }
                },
                {
                    text: "Resend",
                    cssClass: "secondary",
                    handler: () => {
                        console.log("reset data");
                        this.sendForgot(form);
                    }
                },
                {
                    text: "Ok",
                    handler: data => {
                        console.log(data);
                        console.log("Confirm Ok");
                        if (data["otp"]) {
                            this.router.navigate(["/reset-password/" + data["otp"]], {
                                queryParams: {
                                    mobile: 1
                                }
                            });
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

    sendForgot(form?) {
        const request = {
            action_url: "/user/forgot",
            method: "GET",
            params: {}
        };
        if (
            !this.services.emailRegex.test(form.value["email"]) &&
            !this.services.isValidPhoneNumber(form.value["email"])
        ) {
            this.services.notification("Enter Valid Email/Mobile", false);
        } else {
            if (this.isMobile) {
                request["params"]["carrier_code"] = form.value.carrier_code;
                request["params"]["mobile"] = this.services.getPhoneDetails(
                    form.value.email
                )["nationalNumber"];
            } else {
                request["params"]["email"] = form.value["email"];
            }
            this.services.presentLoading();
            this.services.doHttp(request).subscribe(
                data => {
                    this.services.dismissLoading();
                    console.log(data);
                    // this.formReset();
                    this.services.notification(data["status"], true);
                    if ("mobile" in request["params"]) {
                        this.otpAlert(form);
                    } else {
                        this.location.back();
                    }
                },
                err => {
                    // this.form.reset();
                    this.services.dismissLoading();
                    console.log("Error", err);
                    this.services.errorHandler(err);
                }
            );
        }
    }

    ngOnInit() { }
}

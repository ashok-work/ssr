import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CookieDataService } from '../../../services/cookie-service/cookie.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { CommonService } from '../../../services/common-service/common.service';
import { environment } from '../../../../environments/environment';
// import {CookieDataService} from '../../services/cookie-service/cookie.service';
// import {environment} from '../../../environments/environment';
// import {UtilsService} from '../../services/utils/utils.service';
// import {CommonService} from '../../services/common-service/common.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { EventsType } from '../../../interfaces/spaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    isMobile = false;
    errorMsg: any;
    @ViewChild('email') email: ElementRef;


    constructor(public fb: FormBuilder,
        private modalService: BsModalService,
        public cookieService: CookieDataService,
        public utils: UtilsService,
        public services: CommonService) {
        this.services.setTitle('Login');
        this.loginForm = this.fb.group({
            'email': [null, Validators.compose([
                this.emailPhoneValidator,
            ])],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            carrier_code: [this.services.info["carrier_code"].toUpperCase()]
        });
    }

    emailPhoneValidator = (control: FormControl) => {
        let email = control.value;
        if (!email) {
            return {
                empty: {
                    msg: 'Email/mobile number is required.'
                }
            }
        } else {
            let emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;
            let phoneRegex = /((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}/

            if (!email.match(emailRegex) && !this.services.validatePhoneNumber(email)) {
                return {
                    invalid: {
                        msg: 'Email/mobile number is invalid.'
                    }
                }
            }
        }

        return null;
    }

    submitSignin(password: string, email?: string, mobile?: string) {
        let body = {
            'password': password,
        }
        if (email) {
            body["email"] = email;
        } else {
            body["mobile"] = mobile;
        }
        this.services.presentLoading();
        const request = {
            action_url: '/user/login',
            method: 'POST',
            params: body
        };
        this.services.doHttp(request).subscribe(
            (data: any) => {
                this.services.dismissLoading();
                if (data) {
                    this.loginForm.reset();
                    this.utils.setCookie(environment['token'], data['user_token']);
                    this.utils.user_token = data['user_token'];
                    this.utils.getUserDetails(true);
                    this.services.notification("Login Successful", true);
                }
            },
            (err: any) => {
                this.services.dismissLoading();
                console.log('Error', err);
                this.services.notification("data not found", true);
            }
        );
        this.services.dismissLoading();

    }

    formReset() {
        this.loginForm.reset();
        this.loginForm.controls.carrier_code.setValue(
            this.services.info["carrier_code"].toUpperCase()
        );
        this.validatePhoneEmail();
    }


    /**
     * submit user signin form
     * @param value
     */
    submitForm() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value;
            this.loginHandler(formData);
        } else {
            this.services.markFormGroupTouched(this.loginForm);
        }
    }

    loginHandler(formData) {
        let analytics_props = {};
        const request = {
            action_url: "/user/login",
            method: "POST",
            params: {
                password: formData["password"]
            }
        };
        if (this.utils.validateEmail(formData["email"])) {
            request["params"]["email"] = formData["email"];
            analytics_props = {
                method: "Email",
                value: formData["email"]
            };
        } else if (this.utils.validateMobile(formData["email"])) {
            request["params"]["carrier_code"] = formData.carrier_code;
            request["params"]["mobile"] = formData["email"];
            analytics_props = {
                method: "Mobile",
                value: formData["email"]
            };
        } else {
            this.services.notification("Enter Valid Email/Mobile", false);
            return false;
        }
        this.services.presentLoading();
        this.services.doHttp(request).subscribe(
            data => {
                this.services.dismissLoading();
                console.log("token", data);
                if (data) {
                    this.formReset();
                    this.utils.setCookie(
                        this.utils.config["token"],
                        data["user_token"]
                    );
                    this.utils.user_token = data["user_token"];
                    this.services.notifyMsg("Login Successfully", true);
                    this.utils.getUserDetails(true);
                    // Mix Panel Analytics
                    analytics_props['success'] = true;
                    // this.services.addAnalytic({
                    //     action: "Login",
                    //     properties: analytics_props
                    // });
                }
            },
            err => {
                // console.log(err);
                this.services.dismissLoading();
                if ("error" in err) {
                    try {
                        const err_res = err["error"];
                        console.log(err_res);
                        if ("message" in err_res) {
                            this.errorMsg = err_res["message"];
                        } else if ("msg" in err_res) {
                            this.errorMsg = err_res["msg"];
                        } else {
                            this.errorMsg = err_res["status"];
                        }
                    } catch (e) { }
                    setTimeout(() => {
                        this.errorMsg = '';
                    }, 7000);
                }
                // this.services.errorHandler(err);
                // Mix Panel Analytics
                analytics_props['success'] = false;
                // this.services.addAnalytic({
                //     action: "Login",
                //     properties: analytics_props
                // });
            }
        );
    }

    countryChange(event, control) {
        this.loginForm.patchValue({
            carrier_code: event.toString()
        });
        console.log(this.loginForm.value);
        if (this.loginForm.value.carrier_code) {
            this.services.selected_carrier_code = this.loginForm.value.carrier_code;
            this.loginForm.patchValue({
                email: this.loginForm.value['email']
            });
            this.email.nativeElement.focus();
            /*
            if (this.loginForm.valid && this.validatePhoneNumber()) {
              this.loginForm.controls.email.setValue(
                this.services.getAsYouTypeNumber(this.loginForm.value.email)
              );
            }
            */
        }
    }

    validatePhoneEmail() {
        const pattern = /^\d+$/;
        if (!this.loginForm.value.email) {
            this.isMobile = false;
        } else if (this.services.emailRegex.test(this.loginForm.value.email)) {
            this.isMobile = false;
        } else if (pattern.test(this.loginForm.value.email)) {
            // this.validatePhoneNumber();
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }

    validatePhoneNumber() {
        const data = this.loginForm.get("email").value;
        if (!this.services.validatePhoneNumber(data)) {
            return false;
        } else {
            this.loginForm
                .get("email")
                .setValue(this.services.getAsYouTypeNumber(data));
            return true;
        }
    }
}

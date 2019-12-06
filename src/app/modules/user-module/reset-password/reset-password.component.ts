import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { CommonService } from 'src/app/services/common-service/common.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  token: any = false;

  mobile = false;
  email = false;

  constructor(private route: ActivatedRoute,
    public services: CommonService,
    private utilsService: UtilsService,
    private router: Router) {
    this.services.setTitle('Reset Password');
    const password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    const cpassword = new FormControl('', [Validators.minLength(6), CustomValidators.equalTo(password)]);

    this.form = new FormGroup({
      'password': password,
      'cpassword': cpassword
    });
    // this.services.disableMenu();
  }

  /**
   * submit change password form
   */
  submitForm() {
    if (this.form.valid) {
      if (this.token === false) {
        this.router.navigate(['/']);
      } else {
        const formData = this.form.value;
        console.log('form values', formData);
        console.log('email', this.email);
        console.log('mobile', this.mobile);
        let request = {
          action_url: '/user/resetPassword',
          method: 'POST',
          params: {
            'token': this.token,
            'password': formData['password'],
          }
        };
        if (this.mobile) {
          request['params']['mobile'] = this.mobile;
        } else if (this.email) {
          request['params']['email'] = this.email;
        }
        console.log(request);
        this.services.presentLoading();
        this.services.doHttp(request).subscribe(
          data => {
            this.form.reset();
            this.services.dismissLoading();
            this.services.notification(data['status'], true);
            this.router.navigate(['/login']);
          },
          err => {
            this.form.reset();
            this.services.dismissLoading();
            console.log('Error', err);
            this.services.errorHandler(err);
          }
        );
      }
    } else {
      this.services.markFormGroupTouched(this.form);
    }
  }

  /**
   * check token and get email
   */
  checkResetToken() {
    this.services.presentLoading();
    const request = {
      action_url: '/user/reset/' + this.token,
      method: 'GET',
      params: {}
    };
    this.services.doHttp(request).subscribe(
      data => {
        this.services.dismissLoading();
        console.log(data);
        if (this.mobile) {
          if (data.hasOwnProperty('mobile')) {
            this.mobile = data['mobile'];
          }
        } else {
          if (data.hasOwnProperty('email')) {
            this.email = data['email'];
          }
        }
      },
      err => {
        this.services.dismissLoading();
        console.log('Error', err);
        this.services.errorHandler(err);
        this.router.navigate(['/']);
      }
    );
  }

  /**
   * Reset Password Init
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.route.queryParams.subscribe(query_params => {
        console.log('query parms', query_params);
        if ('mobile' in query_params) {
          if (query_params['mobile'] == 1) {
            this.mobile = true;
          }
        }
      });
      this.token = params['token'];
      setTimeout(() => {
        this.checkResetToken();
      }, 500);
    });
  }
}

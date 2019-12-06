import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from '../../services/common-service/common.service';
import { UtilsService } from '../../services/utils/utils.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { OtpPageComponent } from '../../components/otp-page/otp-page.component';
import { CustomValidators } from "ngx-custom-validators";
import { ModalDirective } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { AwsS3Service } from '../../services/aws-s3/aws-s3.service';
import { MatDialog } from '@angular/material';
import { OtpDialogComponent } from 'src/app/components/otp-dialog/otp-dialog.component';


@Component({
  selector: 'app-upgrade-profile',
  templateUrl: './upgrade-profile.component.html',
  styleUrls: ['./upgrade-profile.component.scss']
})
export class UpgradeProfileComponent implements OnInit {
  profileForm: FormGroup;
  mobileForm: FormGroup;
  passwordForm: FormGroup;
  ageLimit = moment().add('years', -18);
  minDateLimit: Date;
  editPhone = false;
  countries: Array<string>;
  otpForm: FormGroup;
  @ViewChild(OtpPageComponent) otpPageComponent: OtpPageComponent;
  @ViewChild("otpModal") public otpModal: ModalDirective;
  startingYear: any = new Date().getFullYear() - 18;
  monthShortNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  listOfDays: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  yearsList: Array<number> = [];

  images: any = [];
  imagesData: any = [];

  constructor(
    public fb: FormBuilder,
    public services: CommonService,
    public utilsService: UtilsService,
    public router: Router,
    public _DomSanitizationService: DomSanitizer,
    public awsServices: AwsS3Service,
    public dialog: MatDialog,
  ) {
    this.services.setTitle('Edit Profile');
    this.countries = environment.countriesArray;
    this.minDateLimit = moment(this.ageLimit).toDate();
    this.ageLimit.format("MM/DD/YYYY");


    this.profileForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, Validators.required],
      dob: this.fb.group({
        month: [null],
        day: [null],
        year: [null]
      }), //this should show "select dob" from in placeholder.
      gender: [null, Validators.required],
    });

    this.profileForm.valueChanges.subscribe(value => { this.findInvalidControls() });

    this.passwordForm = this.fb.group({
      old_password: [null, Validators.required,],
      cpassword: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    // //subscribing to event
    // this.passwordForm.valueChanges.subscribe((value) => {
    //   if (this.passwordForm.valid) {
    //     this.profileForm.markAsDirty();
    //   }
    // })
    this.mobileForm = this.fb.group({
      mobile: [null, Validators.compose([
        Validators.pattern(/\d{10}/),
        Validators.maxLength(10),
        Validators.required
      ])],
      carrier_code: [environment.carrier_code.toUpperCase(), Validators.required],
    });

    /**
    * otp form
    * @type {FormGroup}
    */
    this.otpForm = new FormGroup({
      verification_code: new FormControl("", [
        Validators.required,
        CustomValidators.number
      ])
    });
    this.calculateYear();
  }

  getDaysInMonth(month, year) {
    console.log(month, year);
    if (year == undefined) {
      if (this.profileForm.get('dob').value.year != null) year = this.profileForm.get('dob').value.year;
      else year = this.startingYear;
    }
    if (month == undefined) {
      if (this.profileForm.get('dob').value.month != null) month = this.profileForm.get('dob').value.month;
      else month = 'January';
    }

    month = this.monthShortNames.indexOf(month);
    year = Number.parseInt(year);

    var date = new Date(Date.UTC(year, month, 1));
    this.listOfDays = [];
    while (date.getMonth() === month) {
      this.listOfDays.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
  }

  calculateYear() {
    for (let i = 0; i < 100; i++) {
      this.yearsList.push(this.startingYear - i);
    }
  }

  onCountryCodeSelect(event: string) {
    this.mobileForm.patchValue({
      carrier_code: event
    });
    console.log(this.mobileForm.value);
  }


  public findInvalidControls() {
    const invalid = [];
    const controls = this.profileForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }


  ngOnInit() {

    this.utilsService.getUserDetails(false, true).then(data => {
      const userProfile = this.utilsService.user;

      if (userProfile && userProfile.user_json) {
        this.profileForm.patchValue({
          first_name: userProfile.user_json['first_name'],
          last_name: userProfile.user_json['last_name'],
          email: this.utilsService.user['email'],
          gender: userProfile.user_json['gender'],
        });

        if (this.utilsService.user.user_json.dob) {
          let date = new Date(this.utilsService.user.user_json.dob);
          this.profileForm.controls.dob.patchValue({
            month: this.monthShortNames[date.getMonth()],
            day: date.getDate(),
            year: date.getFullYear(),
          });
        }

        if (!userProfile.user_json['first_name'] && userProfile['user_json']['fullName']) {
          const fullName = userProfile.user_json['fullName'].split(" ");
          if (fullName.length == 2) {
            this.profileForm.patchValue({
              first_name: fullName[0],
              last_name: fullName[1],
            });
          } else if (fullName.length) {
            this.profileForm.patchValue({
              first_name: fullName[0],
            });
          }
          userProfile['user_json']['fullName'] = null;
        }

        this.mobileForm.patchValue({
          mobile: userProfile['mobile']
        });
        if (userProfile.carrier_code) {
          this.mobileForm.patchValue({
            carrier_code: this.utilsService.user.carrier_code.toUpperCase()
          });
        }

        // this.mobileForm.valueChanges.subscribe(val => {
        //   if (this.mobileForm.valid) this.editPhone = true;
        //   else this.editPhone = false;
        // });
      }

      if (!this.utilsService.user['mobile']) {
        this.editPhone = true;
      }
      this.profileForm.markAsUntouched();
    });
  }

  async submitPasswordForm() {
    if (this.passwordForm.dirty && this.passwordForm.valid) {
      // this.services.presentLoading();
      const formData = this.passwordForm.value;
      console.log('form values', formData);
      const request = {
        action_url: '/user/password',
        method: 'PUT',
        params: {
          old_password: formData['old_password'],
          new_password: formData['cpassword']
        }
      };
      try {
        await this.services.doHttp(request).toPromise();
        this.passwordForm.reset();
        this.services.notification('Password updated successfully', true);
      } catch (err) {
        this.services.dismissLoading();
        console.log('Error', err);
        this.services.errorHandler(err);
      }
    } else {
      this.services.markFormGroupTouched(this.passwordForm);
    }
    this.updateProfile();
  }

  updateProfile() {
    if (this.utilsService.user['mobile'] !== this.mobileForm.value['mobile']) {
      this.services.notification('Verify Mobile Number First', false);
      return;
    }
    // if (this.profileForm.pristine) {
    //   console.log("Profile doesn't have any chages.. so, returning back");
    //   return;
    // }
    this.services.presentLoading();
    let formData = this.profileForm.value;
    const password = formData.password;
    delete formData.password;
    const email = formData['email'];
    delete formData.email;
    let date = new Date(formData.dob.year, this.monthShortNames.indexOf(formData.dob.month), formData.dob.day).toISOString();
    formData.dob = date;
    const request = {
      action_url: '/user/',
      method: 'PUT',
      params: { 'user_json': formData, email, password }
    };
    this.services.doHttp(request).subscribe(
      data => {
        console.log(data);
        this.images = [];
        this.imagesData = [];
        this.services.dismissLoading();
        this.services.notification('Details saved successfully', true);
        this.utilsService.getUserDetails();
        // this.router.navigate(["/events"]);
      },
      err => {
        this.services.dismissLoading();
        console.log('Error', err);
        this.services.errorHandler(err);
      }
    );

  }


  updateMobileNo() {
    this.services.presentLoading();
    const request = {
      action_url: '/user/',
      method: 'PUT',
      params: this.mobileForm.value
    };
    this.services.doHttp(request).subscribe(
      data => {
        this.editPhone = !this.editPhone;
        console.log(data);
        this.services.dismissLoading();
        this.services.notification('Details saved successfully', true);
        this.utilsService.getUserDetails();
        this.editPhone = false;
      },
      err => {
        this.services.dismissLoading();
        console.log('Error', err);
        this.services.errorHandler(err);
      }
    );
  }


  submitForm() {
    if (this.profileForm.valid) {
      this.submitPasswordForm();
    }
  }



  /**
  * close review
  */
  openOtpModal() {
    const dialogRef = this.dialog.open(OtpDialogComponent, {
      width: '500px',
      data: {
        mobile: this.mobileForm.value["mobile"],
        carrier_code: this.mobileForm.value["carrier_code"]
      }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.submitOtpForm(result);
        }
      }
    );
    // this.otpForm.reset();
    // setTimeout(() => {
    //   this.otpPageComponent.resendOtp = () => this.resendOtp();
    //   this.otpPageComponent.submitOtpForm = () => this.submitOtpForm();
    //   this.resendOtp();
    // }, 1000);
  }

  /**
   * close review
   */
  closeOtpModal() {
    this.otpForm.reset();
    this.otpModal.hide();
  }

  resendOtp() {
    this.services.presentLoading();
    this.services
      .sendOtpHandler({
        mobile: this.mobileForm.value["mobile"],
        carrier_code: this.mobileForm.value["carrier_code"]
      })
      .then(
        response => {
          this.services.dismissLoading();
          this.services.notification(response["message"], true);
          console.log(response);
          // this.otpModal.show();

        },
        err => {
          this.services.dismissLoading();
          this.services.errorHandler(err);
        }
      );
  }

  submitOtpForm(otpValue) {
    if (otpValue) {
      this.services.presentLoading();
      this.services
        .verifyOtpHandler({
          mobile: this.mobileForm.value["mobile"],
          carrier_code: this.mobileForm.value["carrier_code"],
          verification_code: otpValue
        })
        .then(
          response => {
            console.log(response);
            this.services.dismissLoading();
            this.otpForm.reset();
            this.otpModal.hide();
            this.services.notifyMsg("Mobile verified successfully", true);
            this.updateMobileNo();
          },
          err => {
            this.services.dismissLoading();
            this.services.errorHandler(err);
          }
        );
    } else {
      this.services.markFormGroupTouched(this.otpForm);
    }
    try {
      this.services.dismissLoading();
    } catch (e) { }
  }

  resetOtpForm() {
    this.otpForm.reset();
  }

}

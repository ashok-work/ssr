import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  supportForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public commonServices: CommonService,
    public utils: UtilsService,
  ) {
    this.supportForm = this.fb.group({
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      issue: [null, Validators.required],
      description: [null, Validators.required]
    });
    this.commonServices.setTitle('Support');
  }

  ngOnInit() {
    this.fetchUserDetails();
  }

  async fetchUserDetails() {
    try {
      const result = await this.utils.initApp();
      if (result) {
        const userProfile = this.utils.user;

        console.log(userProfile);

        this.supportForm.patchValue({
          fullName: userProfile.user_name,
          email: userProfile.user_json['email'],
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  submitForm() {
    if (this.supportForm.valid && this.commonServices.emailRegex.test(this.supportForm.value['email'])) {
      console.log(this.supportForm.value);
      this.commonServices.presentLoading();
      const request = {
        action_url: '/user/contact',
        method: 'POST',
        params: this.supportForm.value
      };
      this.commonServices.doHttp(request).subscribe(
        data => {
          console.log(data);
          this.commonServices.dismissLoading();
          this.commonServices.notification(data['msg'], true);
        },
        err => {
          this.commonServices.dismissLoading();
          console.log('Error', err);
          this.commonServices.errorHandler(err);
        }
      );
    } else {
      console.log('invalid');
      this.commonServices.markFormGroupTouched(this.supportForm);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { AwsS3Service } from '../../services/aws-s3/aws-s3.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {

  aadhar = false;
  residency = false;
  old_kyc_data: any = {};
  kyc_data: any = {};
  status: any = 0;
  statusArray = [];

  constructor(
    public router: Router,
    public commonServices: CommonService,
    public awsServices: AwsS3Service,
  ) {
    this.commonServices.setTitle('Verification');
  }

  ngOnInit() {
    this.getKycDetails();
  }

  getKycDetails() {
    const request = {
      action_url: '/kyc',
      method: 'GET',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        console.log(data);
        this.statusArray = [];
        if (Object.keys(data).length) {
          this.kyc_data = data;
          if (this.kyc_data['is_kyc_verified']) this.status = 2;
          else {
            this.status = 3;
            if (!this.kyc_data['address_proof_images']) this.statusArray.push('Residency Proof');
            if (!this.kyc_data['aadhar_front']) this.statusArray.push('Aadhar front side');
            if (!this.kyc_data['aadhar_back']) this.statusArray.push('Aadhar back side');
          }
        }
        else {
          this.status = 1;
        }
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  updateKycDetails(files, flag) {
    let formData: FormData = new FormData();
    if (this.kyc_data['kyc_id']) {
      formData.append('kyc_id', this.kyc_data['kyc_id']);
    }
    if (flag == 1) formData.append('aadhar_front', files.item(0));
    else if (flag == 2) formData.append('aadhar_back', files.item(0));
    else if (flag == 3) formData.append('address_proof_images', files.item(0));

    let request = {
      action_url: '/kyc/docs',
      method: 'PUT',
      params: formData,
      file: true
    };
    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.getKycDetails();
        this.commonServices.notification(data['msg']);
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      }
    );
  }

  getImages(event, flag) {
    event.preventDefault();
    this.updateKycDetails(event.dataTransfer.files, flag);
  }

  handleDrag(event) {
    event.preventDefault();
  }
}
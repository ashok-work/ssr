import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";
import { UtilsService } from "../../services/utils/utils.service";

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
  otpValue: string;
  data: any;

  constructor(
    private dialogRef: MatDialogRef<OtpDialogComponent>,
    public commonServices: CommonService,
    public utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
  }

  ngOnInit() {
    this.resendOtp();
  }

  resendOtp() {
    this.commonServices.presentLoading();
    this.commonServices.sendOtpHandler(this.data).then(
      response => {
        this.commonServices.dismissLoading();
        this.commonServices.notification(response["message"], true);
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    );
  }

  verify() {
    if (this.otpValue) this.dialogRef.close(this.otpValue);
  }

  close() {
    this.dialogRef.close(false);
  }

}

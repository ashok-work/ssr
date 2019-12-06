import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';

@Component({
  selector: 'verify-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.scss']
})
export class OtpPageComponent implements OnInit {
  otpValue: string;
  constructor(public services: CommonService) { }

  ngOnInit() {

  }

  submitOtpForm() { }

  resendOtp = () => {

  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-host-landing',
  templateUrl: './host-landing.component.html',
  styleUrls: ['./host-landing.component.scss']
})
export class HostLandingComponent implements OnInit {

  addressForm: FormGroup;

  constructor(
    public commonServices: CommonService,
    public router: Router,
    public fb: FormBuilder,
  ) {
    this.addressForm = this.fb.group({
      address: [null],
      unit: [null],
      city: [null],
      zip: [null],
      country: [null],
    });
    this.commonServices.setTitle("Hosts");
  }

  ngOnInit() {
  }

}

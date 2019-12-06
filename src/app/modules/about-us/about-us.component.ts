import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(
    public commonServices: CommonService
  ) {
    this.commonServices.setTitle('About Us');
  }

  ngOnInit() {
  }

}

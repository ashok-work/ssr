import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
// import { CommonService } from '../services/common-service/common.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle('Terms');
  }

  ngOnInit() {
    // window.scrollTo(0, 0);
  }

}

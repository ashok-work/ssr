import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  activePage = 1;

  constructor(
    public commonServices: CommonService,
  ) {
    this.commonServices.setTitle('FAQs');
  }

  ngOnInit() {
  }

  selectPage(pageNumber) {
    this.activePage = pageNumber;
  }

}

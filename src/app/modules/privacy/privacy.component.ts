import { Component, AfterViewInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
//import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
// import { ScrollSpyModule, ScrollSpyService } from 'ngx-scrollspy';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements AfterViewInit {

  constructor(//private _scrollToService: ScrollToService,
    public services: CommonService
    // private scrollSpyService: ScrollSpyService
  ) {
    this.services.setTitle("Privacy");
  }

  scrollTo($event, element) {
    /*
  this._scrollToService.scrollTo({
      target: element
  });
  */
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    /*
    this.scrollSpyService.getObservable('sidemenu').subscribe((e: any) => {
      console.log('ScrollSpy::test: ', e);
    });
    */
  }

}

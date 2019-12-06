import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UtilsService } from './services/utils/utils.service';
import { CommonService } from './services/common-service/common.service';
import { environment } from 'src/environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NotificationsService]
})
export class AppComponent implements AfterContentChecked {
  constructor(private utils: UtilsService,
    public router: Router,
    private services: CommonService,
    private cdr: ChangeDetectorRef,
    private scroller: ViewportScroller,
  ) {
    // this.services.loadGMaps();
    this.utils.config = environment;
    this.utils.config['validations'] = {
      email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
      mobile: /^\d{10}$/,
      gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      pan_card: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      ifsc: /^[A-Za-z]{4}\d{7}$/,
      cin: /^[A-Za-z0-9]{21}$/
    };
    this.services.cdkSpinnerCreate();
    // console.log('this.utilsService.config', this.utils.config);
    // this.services.cookieService.set('token', 'b1233796-ef6a-44aa-9371-10582bb0be0c');
    this.utils.initApp();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd) {
        this.scroller.scrollToPosition([0,0]);
      }
    })
  }

}

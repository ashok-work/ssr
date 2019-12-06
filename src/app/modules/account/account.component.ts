import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  activePage = 1;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public commonServices: CommonService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let params = this.route.params['value']

    if (params['page']) this.activePage = parseInt(params['page']);
    else this.router.navigate(['account', '1']);
  }

  ngOnInit() {
    this.commonServices.setTitle('Account');
  }

  selectPage(pageNumber) {
    this.router.navigate(['account', pageNumber]);
  }

}

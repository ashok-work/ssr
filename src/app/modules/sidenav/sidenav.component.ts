import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { CommonService } from '../../services/common-service/common.service';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    // trigger('headerFix', [
    //   state('fixed', style({
    //     position: 'fixed',
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     zIndex: 1030
    //   })),
    //   state('relative', style({
    //     position: 'relative',
    //     zIndex: 1000
    //   })),
    //   transition('fixed <=> relative', [
    //     animate('1s 0s ease-in-out')
    //   ])
    // ])
  ]
})
export class SidenavComponent implements OnInit {
  toolbar_title = 'Spaces';
  showMenuAndFooter = true;
  isFixed = false;
  open = false;
  icon: any;
  promoCode: any;
  promoCodeDesc: any;

  constructor(
    public router: Router,
    public services: CommonService,
    public utils: UtilsService,
    public route: ActivatedRoute,
    public dataService: DataServiceService
  ) {
    this.getPromoCode();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.scrollY > 45 && !this.isFixed) {
      this.isFixed = true;
      document.getElementById('phantom').style.display = 'block';
      document.getElementById('navbar').classList.add('fixed-top');
    } else if (window.scrollY <= 45 && this.isFixed) {
      this.isFixed = false;
      document.getElementById('phantom').style.display = 'none';
      document.getElementById('navbar').classList.remove('fixed-top');
    }
  }

  navigate(title: string, link: string, param?: any) {
    this.toolbar_title = title;
    if (param) this.router.navigate([`/${link}`, param]);
    else this.router.navigate([`/${link}`]);
  }

  navigateToInvites(path, param) {
    if (param) {
      window.open(this.services.info['invites_url'] + path + '/' + param, '_blank')
    } else {
      window.open(this.services.info['invites_url'] + path, '_blank')
    }
  }

  animate(elementId) {
    this.icon = document.getElementById(elementId);
    if (this.icon) {
      if (this.open) {
        this.icon.className = 'fas fa-angle-down';
      } else {
        this.icon.className = 'fas fa-angle-down open';
      }
    }

    this.open = !this.open;
  }

  ngOnInit() {
    this.router.events.subscribe((param) => {
      if (param instanceof NavigationEnd) {
        if (param.url == "/welcome" || param.url == "/") {
          this.showMenuAndFooter = false;
        } else {
          this.showMenuAndFooter = true;
        }
      }
    });
  }

  hidePromo() {
    let elem = document.getElementById('promo');
    elem.classList.add('d-none');
  }

  getPromoCode() {
    const request = {
      action_url: '/coupon/default',
      method: 'GET',
      params: {}
    }

    this.services.doHttp(request).subscribe(
      (data: any) => {
        this.promoCode = data.coupon_code;
        this.promoCodeDesc = data.coupon_desc;
        this.promoCodeDesc = this.promoCodeDesc.replace(/[A-Z][A-Z0-9]+/, (match, index, originalString) => {
          return '<span class="orange-text">' + match + '</span>';
        });
      }, 
      err => {
        this.services.errorHandler(err);
      }
    )
  }

}

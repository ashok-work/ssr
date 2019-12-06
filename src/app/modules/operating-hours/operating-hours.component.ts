import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-operating-hours',
  templateUrl: './operating-hours.component.html',
  styleUrls: ['./operating-hours.component.scss']
})
export class OperatingHoursComponent implements OnInit {

  space_id: any;
  space_name: any;
  operating_hours: any = [];
  operatingHoursFlag = true;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timings: Array<any> = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public commonServices: CommonService,
  ) {
    for (let i = 0; i < 24; i++) {
      this.timings.push(this.createTimeObject(i));
    }
    this.timings.push({
      'hours': 23,
      'minutes': 59,
      'text': "11:59 PM",
      'disabled': false
    });
  }

  createTimeObject(hours) {
    let text = "";

    if (hours == 0) {
      text = "12:00 AM";
    } else if (hours < 12) {
      text = hours + ":00 AM";
    } else if (hours > 12) {
      text = (hours - 12) + ":00 PM";
    } else {
      text = hours + ":00 PM";
    }

    return {
      'hours': hours,
      'minutes': 0,
      'text': text
    }
  }

  addOperatingHours(index) {
    this.operating_hours[index]['hours'].push({
      start_time: '',
      end_time: '',
    });
  }

  removeOperatingHours(index) {
    if (this.operating_hours[index]['hours'].length > 1) this.operating_hours[index]['hours'].splice(-1, 1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 1015) {
      this.resizeElements();
    }
    else {
      this.resizeElements();
    }
  }

  resizeElements() {
    document.getElementById('custom-row').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('left-box').style.height = window.innerHeight - 120 + 'px';
    document.getElementById('right-box').style.height = window.innerHeight - 57 + 'px';
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['space_id'] && param['space_name']) {
        this.space_id = param['space_id'];
        // this.space_name = param['space_name'].replace(/-/g, ' ');
        this.space_name = decodeURIComponent(param['space_name']);
        this.resizeElements();
        this.getOperatingHours();
      }
      else {
        this.router.navigate(['/my-spaces']);
      }
    });
  }

  getOperatingHours() {
    const request = {
      action_url: '/spaces/operating-hours?space_id=' + this.space_id,
      method: 'GET',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        this.operating_hours = data['operating_hours'];
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  toggleAvailability(event, i) {
    this.operating_hours[i]['isOpen'] = event.checked;
    this.operatingHoursFlag = false;
    for (let hour of this.operating_hours) {
      if (hour['isOpen']) this.operatingHoursFlag = true;
    }
  }

  toggleTimes(event, index) {
    if (event.value == 2) {
      this.operating_hours[index]['allDay'] = false;
    } else {
      this.operating_hours[index]['allDay'] = true;
    }
  }

  compareTimeObj(t1: any, t2: any) {
    if (t1 && t2) {
      return t1.hours == t2.hours && t1.minutes == t2.minutes
    }
    return false;
  }

  submitForm() {
    const request = {
      action_url: '/spaces/operating-hours',
      method: 'PUT',
      params: {
        space_id: this.space_id,
        operating_hours: this.operating_hours,
      }
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        this.router.navigate(['/my-spaces']);
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

}

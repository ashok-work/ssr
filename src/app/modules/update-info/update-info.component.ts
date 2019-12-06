import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common-service/common.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {

  space_id: any;
  space_name: any;
  spaceForm: any;
  space_data: any;
  space_info: any;
  event_types: any;
  operating_hours: any = [];
  operatingHoursFlag = true;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timings: Array<any> = [];
  renderUI = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public commonServices: CommonService,
    public fb: FormBuilder,
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

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['space_id'] && param['space_name']) {
        this.space_id = param['space_id'];
        // this.space_name = param['space_name'].replace(/-/g, ' ');
        this.space_name = decodeURIComponent(param['space_name']);
        this.createSpaceForm();
        this.getSpaceMiscInfo();
      }
      else {
        this.router.navigate(['/my-spaces']);
      }
    });
  }

  createSpaceForm() {
    this.spaceForm = this.fb.group({
      'space_id': [this.space_id],
      'amenities': [[]],
      'accessibility': [[]],
      'space_type': [[]],
      'cancellation_policy': [null],
      'catering_available': [true],
      'catering_mandatory': [false],
      'space_rules': [[]],
      'price': [null],
      'min_hours': [null],
      'min_catering_amount': [null],
      'included_hours': [null],
      'discount': [null],
      'price_info': [null],
      'operating_hours': [[]],
    });
  }

  getSpaceMiscInfo() {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/spaces/misc/info'
    };
    this.commonServices.doHttp(request).subscribe(data => {
      this.commonServices.dismissLoading();
      this.space_info = data;
      console.log(this.space_info);
      this.getEventTypes();
    }, error => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    });
  }

  getEventTypes() {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/invite/event_type'
    };
    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        this.event_types = data;
        this.getSpaceDetails();
      },
      error => {
        console.log(error);
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(error);
      });
  }

  getSpaceDetails() {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/spaces/' + this.space_id
    };
    this.commonServices.doHttp(request).subscribe(data => {
      this.commonServices.dismissLoading();
      this.space_data = data;
      this.setSpaceForm();
    }, error => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    });
  }

  setSpaceForm() {
    this.spaceForm.patchValue({
      space_id: this.space_data.space_id,
      space_type: this.space_data.space_type,
      price: this.space_data.price,
      price_info: this.space_data.price_info,
      discount: this.space_data.discount,
      min_hours: this.space_data.min_hours,
      cancellation_policy: this.space_data.cancellation_policy,
      amenities: this.space_data.amenities,
      accessibility: this.space_data.accessibility,
      space_rules: this.space_data.space_rules,
      catering_available: this.space_data.catering_available,
      catering_mandatory: this.space_data.catering_mandatory,
      min_catering_amount: this.space_data.min_catering_amount,
      included_hours: this.space_data.included_hours,
      operating_hours: this.space_data.operating_hours,
    });

    this.checkPolicy();

    this.operating_hours = this.spaceForm.value.operating_hours;
    console.log(this.operating_hours);

    this.renderUI = true;
  }

  /*--------- Operating Hours Code ----------*/

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

  /*-------- Amenities Code ---------*/
  handleAmenities(event, amenity) {
    if (event.checked) {
      this.spaceForm.value.amenities.push(amenity);
    } else {
      let index = this.spaceForm.value.amenities.indexOf(amenity);
      if (index !== -1) this.spaceForm.value.amenities.splice(index, 1);
    }
  }

  checkAmenities(amenity) {
    if (this.spaceForm.value.amenities.indexOf(amenity) == -1) return false;
    return true
  }

  /* -------------- Accessibility Code ---------------- */
  handleAccessibility(event, access) {
    if (event.checked) {
      this.spaceForm.value.accessibility.push(access);
    } else {
      let index = this.spaceForm.value.accessibility.indexOf(access);
      if (index !== -1) this.spaceForm.value.accessibility.splice(index, 1);
    }
  }

  checkAccessibility(access) {
    if (this.spaceForm.value.accessibility.indexOf(access) == -1) return false;
    return true
  }

  /* -------------- Activities Code ---------------- */
  handleTypes(event, type) {
    if (event.checked) {
      this.spaceForm.value.space_type.push(type);
    } else {
      let index = this.spaceForm.value.space_type.indexOf(type);
      if (index !== -1) this.spaceForm.value.space_type.splice(index, 1);
    }
  }

  checkTypes(type) {
    if (this.spaceForm.value.space_type.indexOf(type) == -1) return false;
    return true
  }

  /* -------------- Space Rules Code ---------------- */
  handleRules(event, rule) {
    if (event.checked) {
      this.spaceForm.value.space_rules.push(rule);
    } else {
      let index = this.spaceForm.value.space_rules.indexOf(rule);
      if (index !== -1) this.spaceForm.value.space_rules.splice(index, 1);
    }
  }

  checkRules(rule) {
    if (this.spaceForm.value.space_rules.indexOf(rule) == -1) return false;
    return true
  }

  /* -------------- Cancellation Policy Code ---------------- */
  checkPolicy() {
    let selectedPolicy = this.spaceForm.value.cancellation_policy;
    for (let policy of this.space_info.cancellation_policy) {
      if (selectedPolicy != null && typeof selectedPolicy == 'object' && 'title' in selectedPolicy && selectedPolicy.title == policy.title) {
        policy.selected = true;
      } else {
        policy.selected = false;
      }
    }
  }

  selectPolicy(index) {
    for (let policy of this.space_info.cancellation_policy) {
      policy.selected = false;
    }
    this.space_info.cancellation_policy[index].selected = true;
    this.spaceForm.patchValue({
      cancellation_policy: this.space_info.cancellation_policy[index]
    });
  }

  /*------------ Price Code -------------*/
  checkCatering(event) {
    this.spaceForm.patchValue({
      catering_mandatory: JSON.parse(event.value)
    });
  }

  handleInvalidData(event) {
    if (!((event.keyCode > 95 && event.keyCode < 106)
      || (event.keyCode > 47 && event.keyCode < 58)
      || event.keyCode == 8)) {
      return false;
    }
  }

  handlePaste(event) {
    event.preventDefault();
  }

  submitForm() {
    let formValue = this.spaceForm.value;
    if (formValue.catering_mandatory) {
      let errorText2 = document.getElementById('amount');
      let errorText = document.getElementById('inclHours');
      if (errorText2 && formValue.min_catering_amount > 0) errorText2.classList.add('d-none');
      else if (errorText2) {
        errorText2.classList.remove('d-none');
        return;
      }

      if (errorText && formValue.included_hours > 0) errorText.classList.add('d-none');
      else if (errorText) {
        errorText.classList.remove('d-none');
        return;
      }
    } else {
      let errorText = document.getElementById('price');
      if (errorText && formValue.price > 0) errorText.classList.add('d-none');
      else if (errorText) {
        errorText.classList.remove('d-none');
        return;
      }
    }
    this.spaceForm.patchValue({
      operating_hours: this.operating_hours
    });
    console.log(this.spaceForm.value);

    const request = {
      action_url: '/spaces/update-info',
      method: 'PUT',
      params: this.spaceForm.value,
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

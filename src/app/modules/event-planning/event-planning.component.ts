import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.scss']
})
export class EventPlanningComponent implements OnInit {

  eventPlanningForm: FormGroup;
  business_services: any = [];
  startDate: any;
  endDate: any;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate() - 1);
  timeArray: Array<Object> = [];
  startTimeArray: Array<Object> = [];
  endTimeArray: Array<Object> = [];
  endTimeArray2: Array<Object> = [];
  startTime: any;
  endTime1: any;
  endTime2: any;
  multiDay = false;
  json: any;

  constructor(
    public commonServices: CommonService,
    public fb: FormBuilder,
  ) {
    this.json = JSON;
    this.eventPlanningForm = this.fb.group({
      event_type: [null, Validators.required],
      budget: [null, Validators.required],
      guest_count: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      neighborhood: [null],
      startDateTime: [null, Validators.required],
      endDateTime: [null, Validators.required],
      services: [[]],
      description: [null, Validators.required],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null],
      organization: [null, Validators.required],
    });

    for (let i = 0; i < 24; i++) {
      this.timeArray.push(this.createTimeObject(i));
    }
    this.timeArray.push({
      'hours': 23,
      'minutes': 59,
      'text': "11:59 PM",
      'disabled': false
    });

    this.startTimeArray = [...this.timeArray];
    this.startTimeArray.splice(-1, 1);
    this.endTimeArray = [...this.timeArray];
    this.endTimeArray2 = [...this.timeArray];
  }

  ngOnInit() {
    this.getSpaceMiscData();
  }

  getSpaceMiscData() {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/spaces/misc/info'
    };
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.business_services = data['business_services'];
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  handleService(event, service) {
    if (event.checked) {
      this.eventPlanningForm.value.services.push(service);
    } else {
      let index = this.eventPlanningForm.value.services.indexOf(service);
      if (index !== -1) this.eventPlanningForm.value.services.splice(index, 1);
    }
  }

  compareTimes(time1, time2) {
    if (time1 && time2) return time1.text == time2.text;
    return false;
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
      'text': text,
      'disabled': false
    }
  }

  startDateSelected(event) {
    this.startDate = new Date(event);
    this.patchDateValues();
  }

  endDateSelected(event) {
    this.endDate = new Date(event);
    this.patchDateValues();
  }

  startTimeSelected(event) {
    if (event.target && event.target.value) event = JSON.parse(event.target.value);
    this.startTime = event;
    this.patchDateValues();
  }

  endTimeSelected(event) {
    if (event.target && event.target.value) event = JSON.parse(event.target.value);
    if (this.multiDay) this.endTime2 = event;
    else this.endTime1 = event;
    this.patchDateValues();
  }

  patchDateValues() {
    if (this.startDate) {
      this.eventPlanningForm.patchValue({
        startDateTime: this.startTime ? new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), this.startTime['hours'], this.startTime['minutes']) : new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate())
      });

      if (!this.multiDay) {
        this.eventPlanningForm.patchValue({
          endDateTime: this.endTime1 ? new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), this.endTime1['hours'], this.endTime1['minutes']) : new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate())
        });
      }
    }

    if (this.endDate && this.multiDay) {
      this.eventPlanningForm.patchValue({
        endDateTime: this.endTime2 ? new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate(), this.endTime2['hours'], this.endTime2['minutes']) : new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate())
      });
    }
  }

  submitForm() {
    console.log(this.eventPlanningForm.value);
    if (this.eventPlanningForm.valid) {
      const request = {
        action_url: '/spaces/event_planning',
        method: 'POST',
        params: this.eventPlanningForm.value
      }

      this.commonServices.presentLoading();
      this.commonServices.doHttp(request).subscribe(
        data => {
          this.commonServices.dismissLoading();
          this.commonServices.notification(data['msg']);
          this.eventPlanningForm.reset();
        },
        err => {
          this.commonServices.dismissLoading();
          this.commonServices.errorHandler(err);
        }
      );
    }
  }

}

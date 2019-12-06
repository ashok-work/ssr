import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { promise } from 'protractor';
import { CommonService } from 'src/app/services/common-service/common.service';
import * as  moment from 'moment';
import { Router } from '@angular/router';
import { BookingInfo } from 'src/app/interfaces/spaces';
import { BookingDataService } from 'src/app/services/booking/booking-data.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DataServiceService } from 'src/app/services/data-service.service';

// declare var self: any;

@Component({
  selector: 'plan-event',
  templateUrl: './plan-event.component.html',
  styleUrls: ['./plan-event.component.scss']
})
export class PlanEventComponent implements OnInit, AfterViewInit {
  @Input() capacity: any;
  @Input() operatingHours: any;
  @Input() tax: any;
  @Input() isAuthor: any;
  @Input() allowedEvents: any;
  @Input() catering_mandatory: any;
  spaceId: string;
  planForm: FormGroup;
  filteredStates: Promise<Array<any>>;
  todaysDate = moment(new Date());
  bookedDate = [];
  bookedDatesReceived = false;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate() - 1);
  timeArray: Array<Object> = [];
  startTimeArray: Array<Object> = [];
  endTimeArray: Array<Object> = [];
  endTimeArray2: Array<Object> = [];
  dateSelected = false;
  startTimeSelected = false;
  endDateSelected = false;
  startDate: Date;
  startTime: any;
  startDateTime: Date;
  endDate: Date;
  endDateTime: Date;
  endTime1: any;
  endTime2: any;
  // bookedDatesTimes: Array<Object> = [];
  noOfDays = [0];
  multiDay = false;
  showQuote = false;
  showNotice = false;
  showNotice2 = false;
  duration = 0;
  defaultStartDate = false;
  defaultStartDateValue: any;
  defaultStartTime = false;
  defaultEndDate = false;
  defaultEndDateValue: any;
  defaultEndTime1 = false;
  defaultEndTime2 = false;
  events = [];
  filteredEvents = [];
  guestsIsValid = true;

  defaultStartDateFlag = false;
  defaultEndDateFlag = false;

  stopCheckingFutureEndDates = false;
  prevBlockedEndDate: any;

  subTotal: any;
  discount: any = 0;
  subTotalAfterDiscount: any;
  serviceFee: any;
  gst: any;
  grandTotal: any;
  serviceFeeObj: any;

  json: any;

  constructor(
    private fb: FormBuilder
    , public commonServices: CommonService
    , private router: Router
    , public bookingService: BookingDataService
    , public utils: UtilsService
    , public dataService: DataServiceService,
  ) {
    this.json = JSON;
    let tommorowDate = moment(new Date());
    tommorowDate.add('day', 1);
    this.planForm = this.fb.group({
      plan: [null],
      guests: [null, [Validators.required, this.guestsValidator]],
      event_start_date: [null, Validators.required],
      event_end_date: [null, Validators.required],
    });
    if(this.dataService.selectedEvents.length) {
      this.planForm.patchValue({
        plan: this.dataService.selectedEvents[0].occasion_name,
      });
    }
    for (let i = 0; i < 24; i++) {
      this.timeArray.push(this.createTimeObject(i));
    }
    this.timeArray.push({
      'hours': 23,
      'minutes': 59,
      'text': "11:59 PM",
      'disabled': false
    });

  }

  compareTimes(time1, time2) {
    if (time1 && time2) return time1.text == time2.text;
    return false;
  }

  guestsValidator = (control: FormControl) => {
    let guests = control.value;
    if (guests > 0 && guests <= this.capacity) return null;
    else return {
      error: true
    }
  }

  openPicker(event, picker) {
    event.preventDefault();
    picker.open();
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

  validateStartDate(current_date) {
    current_date = new Date(current_date);
    let dayOfWeek = current_date.getDay();
    let flag = true;
    let min_date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate())
    let max_date = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate())

    if (current_date.getTime() < min_date.getTime() || current_date.getTime() > max_date.getTime()) flag = false;
    else if (this.operatingHours.length > 0 && !this.operatingHours[dayOfWeek]['isOpen']) flag = false;
    else {
      this.bookedDate.forEach(element => {
        let bookedStartDateTime = new Date(element.event_start_date);
        let bookedEndDateTime = new Date(element.event_end_date);
        let bookedStartDate = new Date(
          bookedStartDateTime.getFullYear(),
          bookedStartDateTime.getMonth(),
          bookedStartDateTime.getDate()
        );
        let bookedEndDate = new Date(
          bookedEndDateTime.getFullYear(),
          bookedEndDateTime.getMonth(),
          bookedEndDateTime.getDate()
        );
        if (current_date.getTime() > bookedStartDate.getTime() && current_date.getTime() < bookedEndDate.getTime()) {
          flag = false;
        }
      });
    }

    return flag;
  }

  showAvailableDates = (date) => {
    let current_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let dayOfWeek = current_date.getDay();
    let min_date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate())
    let flag = true;
    if (date.getTime() < min_date.getTime()) flag = false;
    if (this.operatingHours.length > 0 && !this.operatingHours[dayOfWeek]['isOpen']) flag = false;
    if (this.bookedDate.length > 0) {
      flag = this.validateStartDate(current_date);
      if (flag && !this.defaultStartDate) {
        if (this.showAvailableStartTimes(date)) {
          this.defaultStartDate = true;
          this.defaultStartDateValue = date;
        }
      }
      setTimeout(() => { this.defaultStartDateFlag = true; }, 0);
      return flag;
    }
    if (flag && !this.defaultStartDate) {
      if (this.showAvailableStartTimes(date)) {
        this.defaultStartDate = true;
        this.defaultStartDateValue = date;
      }
    }
    setTimeout(() => { this.defaultStartDateFlag = true; }, 0);
    return flag;
  }

  validateEndDate(current_date) {
    current_date = new Date(current_date);
    let startDayOfWeek = this.startDate.getDay();
    let dayOfWeek = current_date.getDay();
    let flag = true;

    if (current_date.getTime() <= this.startDate.getTime()) flag = false;
    else if (this.operatingHours.length > 0 && !this.operatingHours[dayOfWeek]['isOpen']) {
      this.prevBlockedEndDate = current_date;
      flag = false;
    }
    else if (this.operatingHours.length > 0 && this.operatingHours[startDayOfWeek]['isOpen'] && !this.operatingHours[startDayOfWeek]['allDay']) {
      flag = false;
      this.operatingHours[startDayOfWeek]['hours'].forEach(element => {
        if (element['end_time']['text'] == '11:59 PM') flag = true;
      });
    }
    else if (this.prevBlockedEndDate) {
      if (current_date.getTime() - this.prevBlockedEndDate.getTime() == 1000 * 60 * 60 * 24) {
        this.prevBlockedEndDate = current_date;
        flag = false;
      }
    }
    else {
      for (let x in this.bookedDate) {
        let bookedStartDateTime = new Date(this.bookedDate[x].event_start_date);
        let bookedEndDateTime = new Date(this.bookedDate[x].event_end_date);

        if (this.startDateTime.getTime() > bookedStartDateTime.getTime()) continue;
        else {
          if (current_date.getTime() >= bookedStartDateTime.getTime()) {
            flag = false;
            break;
          }
        }
      }
    }

    return flag;
  }

  showAvailableEndDates = (date) => {
    if (this.stopCheckingFutureEndDates) return false;
    let current_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let dayOfWeek = current_date.getDay();
    let flag = true;

    flag = this.validateEndDate(date);

    if (flag && this.bookedDate.length > 0) {
      flag = this.validateEndDate(current_date);
      if (flag && !this.defaultEndDate) {
        if (this.showAvailableEndTimes2(date)) {
          this.defaultEndDate = true;
          this.defaultEndDateValue = date;
        } else {
          this.prevBlockedEndDate = date;
          this.endDate = null;
          flag = false;
        }
      }
      setTimeout(() => { this.defaultEndDateFlag = true; }, 0);
      return flag;
    }
    if (flag && !this.defaultEndDate) {
      if (this.showAvailableEndTimes2(date)) {
        this.defaultEndDate = true;
        this.defaultEndDateValue = date;
      } else {
        this.prevBlockedEndDate = date;
        this.endDate = null;
        flag = false;
      }
    }
    setTimeout(() => { this.defaultEndDateFlag = true; }, 0);
    return flag;
  }

  showAvailableStartTimes(event) {
    this.startTimeArray = [];
    this.timeArray.forEach(time => {
      time['disabled'] = false;
    });
    let flag2 = false;

    this.startTime = null;
    this.startDateTime = null;
    this.endDate = null;
    this.endTime1 = null;
    this.endTime2 = null;
    this.endDateTime = null;
    this.startTimeSelected = false;
    this.endDateSelected = false;
    this.defaultStartTime = false;
    this.defaultEndDate = false;
    this.defaultEndTime1 = false;
    this.defaultEndTime2 = false;
    this.stopCheckingFutureEndDates = false;
    this.calculateHours();

    this.dateSelected = true;
    let selectedStartDate = new Date(event);

    let flag = this.validateStartDate(event);
    if (!flag) {
      document.getElementById('tooltipBtn1').click();
      setTimeout(() => { document.getElementById('tooltipBtn1').click(); }, 2500);
      selectedStartDate = new Date(this.defaultStartDateValue);
    }

    this.startDate = selectedStartDate;
    let dayOfWeek = this.startDate.getDay();
    let operatingHours = this.operatingHours[dayOfWeek];
    let timeArray = [...this.timeArray];
    timeArray.splice(-1, 1);
    timeArray.forEach(time => {
      let selectedStartDateTime = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate(), time['hours']);
      if (selectedStartDateTime.getTime() <= this.minDate.getTime()) time['disabled'] = true;

      this.bookedDate.forEach(element => {
        let bookedStartDateTime = new Date(element.event_start_date);
        let bookedEndDateTime = new Date(element.event_end_date);

        if ((selectedStartDateTime.getTime() >= bookedStartDateTime.getTime()) && (selectedStartDateTime.getTime() < bookedEndDateTime.getTime())) {
          time['disabled'] = true;
        }
      });

      if (!time['disabled'] && this.operatingHours.length > 0 && operatingHours['isOpen'] && !operatingHours['allDay']) {
        time['disabled'] = true;
        operatingHours['hours'].forEach(element => {
          let operatingHourStartTime = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate(), element['start_time']['hours']);
          let operatingHourEndTime = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate(), element['end_time']['hours']);

          if ((selectedStartDateTime.getTime() >= operatingHourStartTime.getTime()) && (selectedStartDateTime.getTime() < operatingHourEndTime.getTime())) {
            time['disabled'] = false;
          }
        });
      }

      if (!time['disabled']) flag2 = true;
      if (!time['disabled'] && !this.defaultStartTime) {
        this.defaultStartTime = true;
        setTimeout(() => { this.showAvailableEndTimes(time); }, 100);
      }
      this.startTimeArray.push(time);
    });
    return flag2;
  }

  showAvailableEndTimes(event) {
    if (event.target && event.target.value) event = this.json.parse(event.target.value);
    this.endTimeArray = [];
    this.defaultEndTime1 = false;
    this.startTimeSelected = true;
    let date = this.startDate;
    let selectedStartDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), event['hours']);
    this.startDateTime = selectedStartDateTime;
    this.startTime = event;
    this.calculateHours();

    let dayOfWeek = this.startDate.getDay();
    let operatingHours = this.operatingHours[dayOfWeek];
    let flag = true;
    let time;
    let timeArray = [...this.timeArray];
    for (let t in timeArray) {
      time = timeArray[t];
      if (!flag) break;
      let selectedEndDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time['hours'], time['minutes']);
      flag = true;

      if (selectedEndDateTime.getTime() <= selectedStartDateTime.getTime()) continue;

      for (let x in this.bookedDate) {
        let bookedStartDateTime = new Date(this.bookedDate[x].event_start_date);
        let bookedEndDateTime = new Date(this.bookedDate[x].event_end_date);

        if (selectedStartDateTime.getTime() > bookedStartDateTime.getTime()) continue;
        else {
          if (selectedEndDateTime.getTime() > bookedStartDateTime.getTime()) {
            flag = false;
            break;
          } else {
            break;
          }
        }
      }

      if (flag && this.operatingHours.length > 0 && operatingHours['isOpen'] && !operatingHours['allDay']) {
        flag = false;
        operatingHours['hours'].forEach(element => {
          let operatingHourStartTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), element['start_time']['hours']);
          let operatingHourEndTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), element['end_time']['hours'], element['end_time']['minutes']);

          if ((selectedEndDateTime.getTime() > operatingHourStartTime.getTime()) && (selectedEndDateTime.getTime() <= operatingHourEndTime.getTime())) {
            flag = true;
          }
        });
      }

      if (flag) {
        if (!this.defaultEndTime1) {
          this.defaultEndTime1 = true;
          this.endTime1 = time;
          setTimeout(() => { this.calculateHours(); }, 100);
        }
        this.endTimeArray.push(time);
      }
    }
  }

  showAvailableEndTimes2(event) {
    this.endTimeArray2 = [];
    let selectedEndDate = new Date(event);

    let isDateValid = this.validateEndDate(event);
    if (!isDateValid) {
      document.getElementById('tooltipBtn2').click();
      setTimeout(() => { document.getElementById('tooltipBtn2').click(); }, 2500);
      selectedEndDate = new Date(this.defaultEndDateValue);
    }

    if (selectedEndDate.getTime() <= this.startDate.getTime()) return;
    this.endDate = selectedEndDate;
    this.endDateSelected = true;
    this.calculateHours();

    let dayOfWeek = this.endDate.getDay();
    let operatingHours = this.operatingHours[dayOfWeek];
    let flag = true;
    let time;
    for (let t in this.timeArray) {
      time = this.timeArray[t];
      if (!flag) break;
      let selectedEndDateTime = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate(), time['hours'], time['minutes']);
      flag = true;

      for (let x in this.bookedDate) {
        let bookedStartDateTime = new Date(this.bookedDate[x].event_start_date);
        let bookedEndDateTime = new Date(this.bookedDate[x].event_end_date);

        if (this.startDateTime.getTime() > bookedStartDateTime.getTime()) continue;
        else {
          if (selectedEndDateTime.getTime() > bookedStartDateTime.getTime()) {
            flag = false;
            break;
          } else {
            break;
          }
        }
      }

      if (flag && this.operatingHours.length > 0 && operatingHours['isOpen'] && !operatingHours['allDay']) {
        flag = false;
        operatingHours['hours'].forEach(element => {
          let operatingHourStartTime = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate(), element['start_time']['hours']);
          let operatingHourEndTime = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate(), element['end_time']['hours']);

          if ((selectedEndDateTime.getTime() >= operatingHourStartTime.getTime()) && (selectedEndDateTime.getTime() <= operatingHourEndTime.getTime())) {
            flag = true;
          }
        });
      }

      if (flag) {
        if (!this.defaultEndTime2) {
          this.defaultEndTime2 = true;
          this.endTime2 = time;
          setTimeout(() => { this.calculateHours(); }, 100);
        }
        this.endTimeArray2.push(time);
      }
    }
    if (this.endTimeArray2.length > 0) return true;
    else return false;
  }

  calculateHours(event = null, flag = false) {
    if (event && flag) this.endTime1 = this.json.parse(event.target.value);
    if (event && flag == false) this.endTime2 = this.json.parse(event.target.value);
    if (this.startDateTime && (this.endTime1 || this.endTime2)) {
      this.showQuote = true;
      let endDate, endTime;
      if (!this.multiDay && this.endTime1) {
        endDate = this.startDate;
        endTime = this.endTime1;
      }
      else if (this.multiDay && this.endTime2) {
        endDate = this.endDate;
        endTime = this.endTime2;
      } else {
        this.showQuote = false;
        return;
      }
      let endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime['hours'], endTime['minutes']);
      this.duration = Math.ceil(Math.abs(endDateTime.getTime() - this.startDateTime.getTime()) / 36e5);
      if (!this.bookingService.spaceBookingDetails.catering_mandatory) {
        if (this.duration < this.bookingService.spaceBookingDetails['min_hours']) {
          this.duration = this.bookingService.spaceBookingDetails['min_hours'];
          this.showNotice = true;
        } else {
          this.showNotice = false;
        }
      } else {
        if (this.duration > this.bookingService.spaceBookingDetails['included_hours']) {
          // this.duration = this.bookingService.spaceBookingDetails['included_hours'];
          this.showNotice2 = true;
        } else {
          this.showNotice2 = false;
        }
      }
      this.subTotal = Number(this.bookingService.spaceBookingDetails.price) * (this.duration);
      this.discount = (this.bookingService.spaceBookingDetails.discount / 100.0) * (this.subTotal);
      this.subTotalAfterDiscount = this.subTotal - this.discount;
      if (this.subTotalAfterDiscount < this.serviceFeeObj.threshold_value) {
        this.serviceFee = (this.serviceFeeObj.service_1_tax / 100.0) * Number(this.subTotalAfterDiscount);
      } else {
        this.serviceFee = (this.serviceFeeObj.service_2_tax / 100.0) * Number(this.subTotalAfterDiscount);
      }
      this.gst = (this.tax / 100.0) * Number(this.subTotalAfterDiscount);
      this.grandTotal = this.subTotalAfterDiscount + this.serviceFee + this.gst;
    } else {
      this.showQuote = false;
    }
  }

  addDate(date, endTime) {
    let selectedEndTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime['hours'], endTime['minutes']);
    this.endDateTime = selectedEndTime;
  }

  // addDay(day) {
  //   this.noOfDays.push(day+1);
  // }

  // removeDay(day) {
  //   this.noOfDays.pop();
  //   this.bookedDatesTimes.splice(day, 1);
  //   this.startTimeArray.splice(day, 1);
  //   this.endTimeArray.splice(day, 1);
  //   delete this.dateSelected[day];
  //   delete this.startTimeSelected[day];
  // }

  onSelectStartTime() {
    if (this.planForm.value.startTime) {
      this.planForm.controls.startDate.setErrors(null);
      const fullStartTime = this.getFullDateTime(this.planForm.value.startDate, this.planForm.value.startTime);
      this.bookedDate.forEach(element => {
        const bookedStartDate = moment(element.event_start_date);
        const bookedEndDate = moment(element.event_end_date);

        if (fullStartTime.isBetween(bookedStartDate, bookedEndDate, null, '[]')) {
          this.planForm.controls.startDate.setErrors({ "booked": true });
        }

      });
    }
  }


  onSelectEndTime() {
    if (this.planForm.value.endTime) {
      this.planForm.controls.endDate.setErrors(null);
      const fullEndDateTime = this.getFullDateTime(this.planForm.value.endDate, this.planForm.value.endTime);
      this.bookedDate.forEach(element => {
        const bookedStartDate = moment(element.event_start_date);
        const bookedEndDate = moment(element.event_end_date);

        if (fullEndDateTime.isBetween(bookedStartDate, bookedEndDate, null, '[]')) {
          this.planForm.controls.endDate.setErrors({ "booked": true });
        }
      });
    }
  }

  ngOnInit() {
    this.tax = 18;
    if (this.operatingHours == null) this.operatingHours = [];
    this.bookingService.spaceId.subscribe((data) => {
      this.spaceId = data;
      if (this.spaceId) {
        this.bookedDate = this.bookingService.spaceBookingDetails.booking_dates;
        this.bookedDatesReceived = true;
        // self = this;
        console.log("Yello", this.bookedDate);
      }
      this.filteredEvents = this.allowedEvents;
      // this.fetchEventsType();
    });
  }

  async ngAfterViewInit() {
    let result = await this.getSpaceMiscData();
    this.serviceFeeObj = result['guest_service_fee'];
    setTimeout(() => {
      document.getElementById('toggle-icon1').click();
    }, 0);
    setTimeout(() => {
      (<HTMLElement>document.getElementsByClassName('cdk-overlay-backdrop')[0]).click();
    }, 10);
  }

  defaultDates() {
    if (this.endDate == null) {
      setTimeout(() => {
        document.getElementById('toggle-icon2').click();
      }, 0);
      setTimeout(() => {
        (<HTMLElement>document.getElementsByClassName('cdk-overlay-backdrop')[0]).click();
      }, 10);
    }
  }

  fetchEventsType() {
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.commonServices.dismissLoading();
        this.events = data;
        this.filteredEvents = this.events;
      },
      (err: any) => {
        this.commonServices.dismissLoading();
        console.log('Error', err);
      }
    );
    this.commonServices.dismissLoading();
  }

  getSpaceMiscData() {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/spaces/misc/info'
    };
    return this.commonServices.doHttp(request).toPromise();
  }

  // filterEvents(value) {
  //   this.filteredEvents = this.events.filter(event => event.occasion_name.toLowerCase().includes(value));
  // }

  filterEvents(filterValue: string) {
    if (filterValue.length > 0) {
      this.filteredEvents = this.allowedEvents.filter((event: any) => event.occasion_name.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredEvents = this.allowedEvents;
    }
  }

  blockSpaces(event_start_date: string, event_end_date: string) {
    if (this.spaceId) {
      const request = {
        action_url: '/spaces/block/' + this.spaceId,
        method: 'PUT',
        params: {
          event_start_date,
          event_end_date
        }
      };
      this.commonServices.presentLoading();
      this.commonServices.doHttp(request).subscribe(
        (data: any) => {
          this.commonServices.dismissLoading();
          console.log("Spaces blocked successfully....!");
          console.log(data);
          this.navigateAway();
        },
        (err: any) => {
          this.commonServices.dismissLoading();
          console.log('Error', err);
          console.log("try again after sometime");
          this.commonServices.errorHandler(err);
        }
      );
    }
  }

  navigateAway() {
    if (this.bookingService.spaceBookingDetails.has_menu) {
      let space_name = this.bookingService.spaceBookingDetails.name.replace(/\s+/g, '-');
      let url = '/booking-menu/' + this.bookingService.spaceBookingDetails.space_id + '/' + space_name;
      this.router.navigate([url]);
    } else {
      this.router.navigate(["/booking-preview"]);
    }
  }

  //return time components with 24 hrs time format
  getTimeComponents(timeStr: string): [number, number, string] {
    if (timeStr) {
      let startTimes = timeStr.split(':');
      let minMeridian = startTimes[1].split(' ');
      if (+startTimes[0] < 12 && (minMeridian[1] == 'pm' || minMeridian[1] == 'PM')) {
        startTimes[0] = `${+startTimes[0] + 12}`;
      }
      return [+startTimes[0], +minMeridian[0], minMeridian[1]];
    }
    return;
  }


  getFullDateTime(dateString: string, timeStr: string): moment.Moment {
    let date = moment(dateString);
    let timeArr = this.getTimeComponents(timeStr);
    date.set('hours', timeArr[0]);
    date.set('minutes', timeArr[1]);
    return date;
  }

  submitForm() {
    if (this.multiDay) this.addDate(this.endDate, this.endTime2)
    else this.addDate(this.startDate, this.endTime1);
    this.planForm.patchValue({ 'event_start_date': this.startDateTime.toISOString(), 'event_end_date': this.endDateTime.toISOString() });
    console.log("Yello", this.planForm.value);
    if (this.planForm.value.guests < 1 || this.planForm.value.guests > this.capacity) this.guestsIsValid = false;
    else this.guestsIsValid = true;
    // this.onSelectStartTime();
    // this.onSelectEndTime();
    // let startDate = this.getFullDateTime(this.planForm.value.startDate, this.planForm.value.startTime);
    // let endDate = this.getFullDateTime(this.planForm.value.endDate, this.planForm.value.endTime);
    // this.planForm.controls.endDate.setErrors(null);

    if (this.planForm.invalid) {
      return;
    }
    // else if (startDate.isAfter(endDate)) {
    //   this.planForm.controls.endDate.setErrors({ preStart: true });
    // } 
    else {
      let body: BookingInfo = {
        space_id: this.spaceId,
        capacity: this.planForm.value.guests,
        guests: this.planForm.value.guests,
        occasion_name: this.planForm.value.plan,
        event_start_date: this.planForm.value.event_start_date,
        event_end_date: this.planForm.value.event_end_date,
        is_cancelled: false,
        service_fee: this.serviceFee,
        gst: this.gst,
        sub_total: this.subTotal,
        discount: this.discount,
        sub_total_after_discount: this.subTotalAfterDiscount,
        grand_total_before_coupon: this.grandTotal,
        catering_mandatory: this.catering_mandatory,
        service_tax: this.subTotal < this.serviceFeeObj.threshold_value ? this.serviceFeeObj.service_1_tax : this.serviceFeeObj.service_2_tax,
        gst_tax: this.tax,
      };
      this.bookingService.currentBookingInfo = body;

      this.setAnalytics();

      if (this.bookingService.spaceBookingDetails.is_allow_full_space_for_rent) {
        this.blockSpaces(body.event_start_date, body.event_end_date);
      } else {
        this.navigateAway();
      }
      // this.bookSpace(body);
    }
  }

  async setAnalytics() {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.spaceId;
    analytics_props['occasion'] = this.planForm.value.plan;
    analytics_props['guestCount'] = this.planForm.value.guests;
    analytics_props['bookingDate'] = this.planForm.value.event_start_date;
    analytics_props['noOfHours'] = this.duration;
    analytics_props['subTotal'] = this.subTotalAfterDiscount;
    analytics_props['total'] = this.grandTotal;
    analytics_props['pricingType'] = this.grandTotal > 0 ? 'hourly' : 'package';
    try {
      const result = await this.utils.initApp();
      if (result) {
        const userProfile = this.utils.user;
        if(userProfile && userProfile.user_id) {
          analytics_props['userIdentifier'] = userProfile.user_id;
        } else {
          analytics_props['userIdentifier'] = "Anonymous";
        }
      }
    } catch(err) {
      analytics_props['userIdentifier'] = "Anonymous";
      console.log(err);
    }

    this.commonServices.addAnalytic({
      action: "RequestToBook",
      properties: analytics_props,
    });
  }

}

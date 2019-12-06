import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() space_id: any;
  contactForm: FormGroup;
  filteredEvents: any = this.dataService.events;

  constructor(
    public fb: FormBuilder,
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public utilsService: UtilsService,
  ) {

    this.contactForm = this.fb.group({
      space_id: [null, Validators.required],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      occasion: [null, Validators.required],
      guest_count: [null, Validators.required],
      description: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.fetchEvents();

    this.utilsService.getUserDetails().then(data => {
      const userProfile = this.utilsService.user;

      this.contactForm.patchValue({
        space_id: this.space_id,
        first_name: userProfile.user_json['first_name'],
        last_name: userProfile.user_json['last_name'],
        email: userProfile.user_json['email'],
        phone: userProfile['mobile']
      });
    });
  }

  fetchEvents() {
    if (this.dataService.events.length > 0) {
      this.filteredEvents = this.dataService.events;
      return;
    }
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe((data: []) => {
      this.filteredEvents = data;
      this.dataService.events = data;
      this.dataService.eventTypesLength = data.length;
    }, (err) => {
      console.log(err);
    });
  }

  applyEventsFilter(filterValue: string) {
    console.log(filterValue);
    if (filterValue.length > 0) {
      console.log("looking for", filterValue);
      this.filteredEvents = this.dataService.events.filter((event: any) => event.occasion_name.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredEvents = this.dataService.events;
    }
  }

  submitSearch() {
    if (this.contactForm.valid) {
      const request = {
        action_url: '/spaces/contact_us',
        method: 'POST',
        params: this.contactForm.value
      };

      this.commonServices.presentLoading();
      this.commonServices.doHttp(request).subscribe(
        data => {
          this.commonServices.notification(data['msg']);
          this.commonServices.dismissLoading();
        },
        err => {
          this.commonServices.errorHandler(err);
          this.commonServices.dismissLoading();
        }
      );
    }
  }

}

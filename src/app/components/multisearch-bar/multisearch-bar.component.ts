import { Component, OnInit } from '@angular/core';
import { EventsType } from '../../interfaces/spaces';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common-service/common.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-multisearch-bar',
  templateUrl: './multisearch-bar.component.html',
  styleUrls: ['./multisearch-bar.component.scss']
})
export class MultisearchBarComponent implements OnInit {
  eventsMeta: Array<EventsType>;
  SelectedEvents: FormControl = new FormControl();
  selectedLocation: FormControl = new FormControl();
  searchInput: FormControl = new FormControl();

  constructor(
    public router: Router
    , public commonServices: CommonService
    , public dataService: DataServiceService
  ) {
    // this.fetchEventsType();
    // this.fetchLocations();
  }


  fetchEventsType() {
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: Array<EventsType>) => {
        // this.commonServices.dismissLoading();
        this.dataService.events = data;
      },
      (err: any) => {
        // this.commonServices.dismissLoading();
        console.log('Error', err);
      }
    );
    // this.commonServices.dismissLoading();

  }

  fetchLocations() {
    // this.commonServices.presentLoading();
    const request = {
      action_url: '/spaces/cities',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: Array<EventsType>) => {
        // this.commonServices.dismissLoading();
        this.dataService.locations = data;
      },
      (err: any) => {
        // this.commonServices.dismissLoading();
        console.log('Error ', err);
      }
    );
    // this.commonServices.dismissLoading();
  }


  ngOnInit() {

  }

  async submitSearch() {
    if (this.SelectedEvents.value) {
      this.dataService.selectedEvents = this.SelectedEvents.value;
      this.dataService.selectedLocation = this.selectedLocation.value.city;
      const searchNames = this.dataService.selectedEvents.map(event => event.occasion_name);
      const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
      let queryParams = {
        refresh: new Date().getTime()
      };
      if (searchNames.length) {
        queryParams['events'] = searchNames.join()
      }
      if (searchIds.length) {
        queryParams['event_ids'] = searchIds.join()
      }
      if (this.selectedLocation.value && this.selectedLocation.value.city) {
        this.router.navigate(["/spaces", this.selectedLocation.value.city], {
          queryParams: queryParams
        });
      }
      // else {
      //   this.router.navigate(["/spaces"]);
      // }
      // this.dataService.fetchSpacesEmitter.emit(true);
    }

  }

  /// search for space based on given
}

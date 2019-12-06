import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { Router } from '@angular/router';
import { Maps } from 'src/app/services/maps/maps';

@Component({
  selector: 'app-new-search',
  templateUrl: './new-search.component.html',
  styleUrls: ['./new-search.component.scss']
})
export class NewSearchComponent implements OnInit {

  events: any = [];
  homepageEvents = [];
  filteredEvents: Array<any> = [];
  filteredCities: Array<any> = [];
  searchForm: FormGroup;
  minDate = new Date();
  showError = false;

  @Input() dropdown: any;

  constructor(
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public router: Router,
    public fb: FormBuilder,
    public maps: Maps,
  ) {
    this.searchForm = this.fb.group({
      selectedEvent: [null, Validators.required],
      selectedLocation: [null],
      lat: [null],
      lng: [null],
      selectedDate: [null]
    });
  }

  ngOnInit() {
    this.fetchEvents();
    this.fetchHomepageEvents();
    this.fetchLocations();
  }

  fetchEvents() {
    if (this.dataService.events.length > 0) {
      this.events = this.dataService.events;
      return;
    }
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe((data: []) => {
      this.events = data;
      this.dataService.events = data;
      this.dataService.eventTypesLength = data.length;
    }, (err) => {
      console.log(err);
    });
  }

  fetchHomepageEvents() {
    const request = {
      action_url: '/invite/event_type?type=home',
      method: 'GET',
      params: {}
    };

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.homepageEvents = data;
        this.filteredEvents = data;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  fetchLocations() {
    if (this.dataService.locations.length > 0) {
      this.filteredCities = this.dataService.locations;
      return;
    }
    const request = {
      action_url: '/spaces/cities',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.dataService.locations = data;
        this.filteredCities = this.dataService.locations;
      },
      (err: any) => {
        console.log('Error ', err);
      }
    );
  }

  getOccasionName(event) {
    if (event) return event.occasion_name;
    return '';
  }

  viewAllEvents() {
    this.router.navigate(["/all-events"]);
  }

  applyEventsFilter(filterValue: string) {
    console.log(filterValue);
    if (filterValue.length > 0) {
      console.log("looking for", filterValue);
      this.filteredEvents = this.dataService.events.filter((event: any) => event.occasion_name.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredEvents = this.homepageEvents;
    }
  }

  applyCityFilter(filterValue: string) {
    if (filterValue.length > 0) {
      console.log("looking for", filterValue);
      this.filteredCities = this.dataService.locations.filter((location: any) => location.city.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredCities = this.dataService.locations;
    }
  }

  public handleAddressChange(place: any) {
    let address = this.maps.getFormatAddress(place);
    address['lat'] = place.geometry.location.lat();
    address['lng'] = place.geometry.location.lng();
    this.setAddressFormValues(address);
    console.log('address', address);
  }

  setAddressFormValues(address: { [key: string]: any }) {
    this.searchForm.patchValue({
      selectedLocation: address['city'],
      lat: address['lat'],
      lng: address['lng'],
    });
  }

  submitSearch() {
    if (this.searchForm.valid) {
      this.showError = false;
      if (this.dropdown) this.dropdown.hide();
      console.log(this.searchForm.value);
      this.dataService.selectedEvents = [this.searchForm.value.selectedEvent];
      this.dataService.selectedLocation = this.searchForm.value.selectedLocation;
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
      if (this.searchForm.value.lat) {
        queryParams['lat'] = this.searchForm.value.lat
      }
      if (this.searchForm.value.lng) {
        queryParams['lng'] = this.searchForm.value.lng
      }
      if (this.searchForm.value.selectedLocation) {
        this.router.navigate(["/spaces", this.searchForm.value.selectedLocation], {
          queryParams: queryParams
        });
      } else {
        this.router.navigate(["/spaces"], {
          queryParams: queryParams
        });
      }
    } else {
      this.showError = true;
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  attachListener() {
    document.getElementsByTagName('mat-calendar')[0].addEventListener('click', this.stopPropagation);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsType } from '../../interfaces/spaces';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router"
import { DataServiceService } from '../../services/data-service.service';
import { CommonService } from '../../services/common-service/common.service';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  eventsMeta: Array<EventsType>;
  SelectedEvent: EventsType;
  selectedLocation: string;
  selectedEventLocation: string = null;
  filteredEvents: Array<EventsType>;
  filteredCities: Array<any>;
  SelectedEvents: Array<any> = [];
  showDropDown = false;
  cityEmitterSubscription: any;
  eventsEmitterSubscription: any;

  constructor(
    public router: Router
    , public route: ActivatedRoute
    , public commonServices: CommonService
    , public dataService: DataServiceService
    , public fb: FormBuilder
  ) {
    this.fetchEventsType();
    this.fetchLocations();

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     let params = null;
    //     let routeParams = null;
    //     this.selectedLocation = '';

    //     if (this.route.firstChild) {
    //       routeParams = this.route.firstChild.params['value'];
    //     }

    //     params = this.route.queryParams['value'];

    //     if (params.event_ids && params.events) {

    //       this.SelectedEvents = [];

    //       let event_ids = params.event_ids.split(',');
    //       let events = params.events.split(',');

    //       for (let i = 0; i < event_ids.length; i++) {
    //         this.SelectedEvents.push({
    //           occasion_id: event_ids[i],
    //           occasion_name: events[i],
    //         });
    //       }

    //       this.dataService.selectedEvents = this.SelectedEvents;
    //     }

    //     if (routeParams) {
    //       if (routeParams['placeId']) {
    //         this.selectedLocation = routeParams['placeId'];
    //         this.dataService.selectedLocation = this.selectedLocation;
    //       }
    //     }
    //   }
    // });

    this.cityEmitterSubscription = this.dataService.cityEmitter.subscribe(value => {
      if (value) {
        this.selectedLocation = this.dataService.selectedLocation;
      }
    });

    this.eventsEmitterSubscription = this.dataService.eventsEmitter.subscribe(value => {
      if (value) {
        this.SelectedEvents = this.dataService.selectedEvents;
      }
    });
  }


  onSelectEvent(selectedEvent: EventsType) {
    this.SelectedEvent = selectedEvent;
    this.filteredEvents = [];
    this.filteredCities = this.dataService.locations;
  }

  onSelectCity(selectedCity: any) {
    this.selectedLocation = selectedCity.city;
    this.filteredEvents = [];
    this.filteredCities = this.dataService.locations;
  }


  clearSearches() {
    this.showDropDown = false;
    this.selectedEventLocation = null;
  }


  applyFilter(filterValue: string) {
    if (filterValue.length >= 2) {
      console.log("looking for", filterValue);
      this.filteredEvents = this.dataService.events.filter((event: EventsType) => event.occasion_name.toUpperCase().includes(filterValue.toUpperCase()));
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



  fetchEventsType() {
    // this.commonServices.presentLoading();
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: Array<EventsType>) => {
        // this.commonServices.dismissLoading();
        this.dataService.events = data;
        this.dataService.eventTypesLength = data.length;
        if (this.SelectedEvents.length <= 0) {
          [...this.dataService.events].forEach((event) => {
            this.SelectedEvents.push(event);
          });
        }
      },
      (err: any) => {
        // this.commonServices.dismissLoading();
        console.log('Error', err);
      }
    );
    // this.commonServices.dismissLoading();

  }

  compareEventObj(t1: any, t2: any) {
    if (t1 && t2) {
      return t1.occasion_id == t2.occasion_id;
    }
    return false;
  }

  toggleSelection(event) {
    if (event.checked) this.SelectedEvents = this.dataService.events;
    else this.SelectedEvents = [];
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
        this.filteredCities = this.dataService.locations;
      },
      (err: any) => {
        // this.commonServices.dismissLoading();
        console.log('Error ', err);
      }
    );
    // this.commonServices.dismissLoading();
  }


  openFilter() {
    this.showDropDown = true;
  }


  ngOnInit() {

  }

  async submitSearch() {
    if (this.SelectedEvents.length > 0) {
      this.showDropDown = false;
      this.dataService.selectedEvents = this.SelectedEvents;
      this.dataService.selectedLocation = this.selectedLocation;
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
      if (this.selectedLocation) {
        this.router.navigate(["/spaces", this.selectedLocation], {
          queryParams: queryParams
        });
        this.selectedLocation = '';
      }
      // else {
      //   this.router.navigate(["/spaces"], {
      //     queryParams: queryParams
      //   });
      // }
      // this.dataService.fetchSpacesEmitter.emit(true);
    }

  }

  /// search for space based on given
}
